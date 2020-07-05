require('dotenv').config();
const { Model } = require('./model');
const { Validator } = require('./validators');
let {sign} = require('./../config/jwt');
const crypto = require('crypto');

const farmerSchema = {
    password: new Validator().required().string(),
    email: new Validator().required().string(),
    name: new Validator().string()
}

const farmerModel = new Model('farmer');

function hashUser(req, res, next) {
    const data = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(data.password, salt, 1000, 64, `sha512`, (err, key) => {
        if (!err) {
            req.body = {
                ...req.body,
                password: key.toString('hex'),
                salt
            }
            next();
            return;
        }
        res.status(500).json({ message: 'unknown error' })
    });

}


function login(reqData, farmerData) {
    return new Promise((resolve, reject) => {
        const { password } = reqData;
        const { salt } = farmerData;
        crypto.pbkdf2(password, salt, 1000, 64, `sha512`, (err, key) => {
            if (!err && farmerData.password === key.toString('hex')) {
                const {password, salt, ...data} = farmerData;
                resolve(sign(data));
                return;
            }
            reject();
        });
    })
}


function currentDatePlusExpiration() {
    return new Date(Date.now() + TOKEN_EXPIRATION_TIME );
}



module.exports = {
    farmerSchema, farmerModel, hashUser, login
}