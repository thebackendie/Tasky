const AppError = require('../../utils/appError');

const checkRequiredFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = [];
        
        for (const field of requiredFields) {
          if (!(field in req.body)) {
            missingFields.push(field);
          }
        }
        
        if (missingFields.length > 0) {
            const message = `Missing required fields: ${missingFields.join(', ')}`;
            return next(new AppError(message, 400));
        }
        
        next();
    };
}; 

module.exports = checkRequiredFields;