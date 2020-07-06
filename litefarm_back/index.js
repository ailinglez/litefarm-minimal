const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(require('./routes/index'));

app.listen(3000 , () => {
    console.log('Listening in port', process.env.PORT || 3000);
});