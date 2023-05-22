const express = require('express');
const morgan  = require('morgan');

const dotenv = require('dotenv');
dotenv.config({ path: './config/.env'});

const dbConn = require('./config/dbConnection');
dbConn();


const bodyParser = require('body-parser');

const app = express();

// Logging Routes
app.use(morgan('dev'));

const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(port, () =>{
    console.log(`Server is running at port: ${port}`);
})