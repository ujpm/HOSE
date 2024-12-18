import { validationResult } from 'express-validator';
import ErrorResponse from '../utils/errorResponse.js';

const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors = errors.array().map(err => err.msg);
        return next(new ErrorResponse(extractedErrors[0], 400));
    };
};

export default validate;
