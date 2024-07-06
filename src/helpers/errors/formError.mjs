import BaseError from "./baseError.mjs";
import httpStatusCode from "../../constants/httpStatusCode.mjs";

class FormError extends BaseError {
    constructor(message, errors,name = 'FormError', httpCode = httpStatusCode.UNPROCESSABLE, isOperational = true) {
        super(name, httpCode, message, errors, isOperational);
        Object.setPrototypeOf(this, new.target.prototype);
        
    }
}

export default FormError;