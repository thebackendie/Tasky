const mongoose = require('mongoose');

const DB = process.env.DATABASE_LOCAL;

const dbConn = () => {
    try {
        const conn = mongoose.connect(DB);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database ");
    }
};

const Sequelize = require('sequelize');

let db_host = undefined;
let db_user = undefined;
let db_name = undefined;
let db_password = undefined;

if (process.env.NODE_ENV === 'development'){
    switch (process.env.WORK_STATE) {
      case 'local':
        db_host = process.env.DATABASE_LOCAL_STAGING_HOST;
        db_user = process.env.DATABASE_LOCAL_STAGING_USER;
        db_name = process.env.DATABASE_LOCAL_STAGING_DB_NAME;
        db_password = process.env.DATABASE_LOCAL_STAGING_PASSWORD;
        break;
      case 'remote':
        db_host = process.env.DATABASE_REMOTE_STAGING_HOST;
        db_user = process.env.DATABASE_REMOTE_STAGING_USER;
        db_name = process.env.DATABASE_REMOTE_STAGING_DB_NAME;
        db_password = process.env.DATABASE_REMOTE_STAGING_PASSWORD;
        break;
      default:
        db_host = process.env.DATABASE_LOCAL_STAGING_HOST;
        db_user = process.env.DATABASE_LOCAL_STAGING_USER;
        db_name = process.env.DATABASE_LOCAL_STAGING_DB_NAME;
        db_password = process.env.DATABASE_LOCAL_STAGING_PASSWORD;
    }
  }

const sequelize = new Sequelize(db_name, db_user, db_password, {
    dialect: 'mysql',
    host: db_host,
    logging: false
  });

sequelize
    .authenticate()
    .then(() => {
      console.log("Connection established");
    })
    .catch((err) => {
     console.error("Unable to connect the database: ", err);
    });


module.exports = {dbConn, sequelize};