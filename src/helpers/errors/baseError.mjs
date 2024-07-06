class BaseError extends Error {
    constructor(name, httpCode, message, errors,isOperational) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype);
        
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        this.errors = errors
    }
};

export default BaseError;

