import BaseError from "./baseError.mjs";


class ErrorHandler {
    handleError(error, res) {
        console.log(error)
                
        res.status(error.httpCode).json({
            code: error.httpCode || 401,
            message: error.message,
            errors: error.errors
        });
    }

    isTrustedError(error) {
        if(error instanceof BaseError) {
            return error.isOperational
        } 

        return false;
    }
}

export default Object.freeze(new ErrorHandler());