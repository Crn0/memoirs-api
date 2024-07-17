import APIError from '../helpers/errors/apiError.mjs';
import httpStatusCode from '../constants/httpStatusCode.mjs';

const isAdminOrAuthor = (req, res, next) => {
    const { user } = req;

    if (['Admin', 'Author'].includes(user.membership)) {
        next();

        return;
    }

    const error = new APIError(
        'You are not authorized to access this protected resource',
        'Unauthorize Access',
        'AuthorizationError',
        httpStatusCode.UNAUTHORIZED
    );

    next(error);
};

export default isAdminOrAuthor;
