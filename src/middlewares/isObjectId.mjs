import mongoose from 'mongoose';
import APIError from '../helpers/errors/apiError.mjs';
import httpStatusCode from '../constants/httpStatusCode.mjs';

const validObjectId = (idName) => (req, res, next) => {
    const id = req.params[idName];

    if (mongoose.isValidObjectId(id)) {
        next();

        return;
    }

    const error = new APIError(
        'Bad Request',
        `Invalid ${idName}`,
        'ClientError',
        httpStatusCode.BAD_REQUEST
    );

    next(error);
};

export default validObjectId;
