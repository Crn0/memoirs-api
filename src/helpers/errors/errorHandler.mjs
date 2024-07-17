import 'dotenv/config';
import BaseError from './baseError.mjs';

class ErrorHandler {
    handleError(error, res) {
        process.env.NODE_ENV === 'development' && console.log(error);

        res.status(error.httpCode).json({
            code: error.httpCode || 401,
            error: {
                name: error.name,
                message: error.errors,
            },
            message: error.message,
        });
    }

    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }

        return false;
    }
}

export default Object.freeze(new ErrorHandler());
