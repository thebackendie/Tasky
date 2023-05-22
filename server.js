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

// Routers
const authRoute = require('./routes/v1/authRoute');

// Routes
app.use('/api/v1/auth', authRoute);

// Error Handling
const { notFound, errorHandler } = require('./middlewares/v1/errorHandler');

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const sequelize = require('./config/db_connection').sequelize;

sequelize
    .sync( { alter:true })
    .then(result => {
        console.log("Database synced.")
        const server = app.listen(port, () => {
            console.log(`App running on port ${port}...`);
            console.log(`App running in ${process.env.NODE_ENV} environment...`);
        });
    })
.catch( error => {console.log(error);
});

// Handling Unhandled Rejection
process.on('unhandledRejection', err => {
    console.log(`An error occurred: ${err.name}, ${err.message}`);
    console.log('Unhandled rejection! shutting down server...');
    server.close(() => { process.exit(1); });
});