const AppError = require('../../utils/appError');

// Not Found Errors
const notFound = (req, res, next) => {
    const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(error);

};

// Not Null Validation Errors
const notNull = (err, req) => {
   
    const missingFields = [];
    
    for (const field of err) {
        missingFields.push(field.path);
    }
    
    if (missingFields.length > 0) {
        const message = `Missing required fields: ${missingFields.join(', ')}`;
        return new AppError(message, 400);
    }
    
};

// Handle Errors with Tokens
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);
  
// Handle Expired Tokens
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// Send Error
const sendError = (err, req, res) => {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
        success: err.success,
        message: err.message
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
    });
};

// Error Handler
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 400;
    let errors = { ...err };
    errors.message = err.message;

    console.log("error from error handler: ", err);


    // if (err.code === 11000) errors = handleDuplicateFieldsDB(errors);

    // if (err.name === 'CastError') errors = handleCastErrorDB(errors);

    // if (err.name === 'ValidationError') errors = handleValidationErrorDB(errors);
    
    if (err.name === 'SequelizeValidationError') errors = notNull(errors.errors, req);

    if (err.name === 'JsonWebTokenError') errors = handleJWTError();
    
    if (err.name === 'TokenExpiredError') errors = handleJWTExpiredError();

    // sending error to users
    sendError(errors, req, res);
};

module.exports = {notFound, errorHandler};