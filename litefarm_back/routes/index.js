const express = require('express');
const router = express.Router();

router.use('/farmer', require('./farmer'));
router.use('/farm', require('./farm'));
router.use('/field', require('./field'));

module.exports = router;
