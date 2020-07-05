const express = require('express');
const router = express.Router();
const { farmerModel, farmerSchema, hashUser, login } = require('./../models/farmer');
const { validateSchema } = require('./../models/validators');
const { verify } = require('../config/jwt');
const { farmModel } = require('../models/farm');

router.post('/', validateSchema(farmerSchema), hashUser, (req, res) => {
    farmerModel.insert(req.body, ['email', 'name']).then((data) => {
        res.status(201).json(data);
    })
});

router.post('/login', validateSchema(farmerSchema), (req, res, next) => {
    farmerModel.retrieve({ email: req.body.email }).then((data) => {
        if (data.length === 1) {
            const [userData] = data;
            login(req.body, userData).then((token) => {
                res.status(200).json({token});
            }).catch(() => {
                res.status(401).json({
                    message: 'Unathorized'
                });
            });
        } else {
            res.status(404).json({
                message: 'User not found'
            });
        }
    })
})


router.get('/:id/farm', verify, (req, res) => {
    const id = req.params.id;
    if (Number(id) !== req.user.id) {
        res.status(401).json({message: 'You are trying to access resources not owned by you'});
        return;
    }
    farmModel.retrieve({farmer_id: Number(id)}).then((data) => {
        if(data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({message: 'No farms found for the given user'});
        }
    });
})

module.exports = router;
