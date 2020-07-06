const { Model } = require('./model');
const { Validator } = require('./validators');

const fieldSchema = {
    name: new Validator().required().string(),
    points: new Validator().required(),
    total_area: new Validator().required().number(),
    farm_id: new Validator().required().number()
}

const fieldModel = new Model('field');

module.exports = {
    fieldModel,
    fieldSchema
}