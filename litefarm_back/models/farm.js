const { Model } = require('./model');
const {Validator} = require('./validators');

const farmSchema = {
    farmer_id: new Validator().required().number(),
    name: new Validator().required().string(),
    total_area: new Validator().number(),
    address_id: new Validator().required().string(),
    measure_system: new Validator().required().number()
}

const farmModel = new Model('farm');

module.exports = {
    farmSchema, 
    farmModel
}