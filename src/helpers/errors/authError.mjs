import BaseError from './baseError.mjs';
import httpStatusCode from '../../constants/httpStatusCode.mjs';

class AuthenticateError extends BaseError {
    constructor(
        message,
        errors,
        name = 'Authenticate Error',
        httpCode = httpStatusCode.UNAUTHORIZED,
        isOperational = true
    ) {
        super(name, httpCode, message, errors, isOperational);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default AuthenticateError;
