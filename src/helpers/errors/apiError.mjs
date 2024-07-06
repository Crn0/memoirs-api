import BaseError from "./baseError.mjs";
import httpStatusCode from "../../constants/httpStatusCode.mjs";

class APIError extends BaseError {
    constructor(message, errors, name = 'AuthenticationError', httpCode = httpStatusCode.INTERNAL_SERVER, isOperational = true) {
        super(name, httpCode, message, errors, isOperational);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default APIError;