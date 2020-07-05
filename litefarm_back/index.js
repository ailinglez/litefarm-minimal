const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
app.use(bodyParser.json());

app.use(require('./routes/index'));

app.listen(parseInt(process.env.PORT, 10) || 3000 , () => {
    console.log('Listening in port', process.env.PORT || 3000);
});