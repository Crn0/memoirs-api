import BaseError from './baseError.mjs';
import httpStatusCode from '../../constants/httpStatusCode.mjs';

class CloudinaryError extends BaseError {
    constructor(
        message = 'NOT FOUND',
        errors,
        httpCode = httpStatusCode.NOT_FOUND,
        name = 'Cloudinary Error',
        isOperational = true
    ) {
        super(name, httpCode, message, errors, isOperational);
    }
}

export default CloudinaryError;
