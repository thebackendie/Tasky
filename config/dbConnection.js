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

module.exports = dbConn;