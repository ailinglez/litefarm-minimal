const express = require('express');
const router = express.Router();
const { farmSchema, farmModel } = require('../models/farm');
const { validateSchema } = require('../models/validators');
const { verify } = require('../config/jwt');
const { fieldModel } = require('../models/field');


router.post('/', validateSchema(farmSchema), verify, (req,res) => {
    farmModel.insert(req.body).then(data => {
        res.status(200).json(data);
    }).catch(() => {
        res.status(500).json({message: 'Unknown error'});
    })
})

router.get('/:id/fields', verify, (req,res) => {
    fieldModel.retrieve({farm_id: req.params.id}).then((data) => {
        if(data.length > 0 ) {
            res.status(200).json(data);
        }else {
            res.status(404).json({message: 'Not found'});
        }
    })
})

module.exports = router;
