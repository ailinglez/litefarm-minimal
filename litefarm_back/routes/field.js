const express = require('express');
const {verify} = require('./../config/jwt');
const { fieldSchema, fieldModel } = require('../models/field');
const { validateSchema } = require('../models/validators');
const router = express.Router();

router.post('/', validateSchema(fieldSchema) ,verify , (req, res) => {
    fieldModel.insert(req.body).then((data) => {
        res.status(200).json(data);
    });
});

module.exports = router;
