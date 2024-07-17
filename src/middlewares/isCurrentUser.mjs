import APIError from '../helpers/errors/apiError.mjs';
import httpStatusCode from '../constants/httpStatusCode.mjs';

const isCurrentUser = (req, res, next) => {
    const { userId } = req.params;
    const { user } = req;

    if (user._id === userId) {
        next();

        return;
    }

    const error = new APIError(
        'You cannot modify the data. You are not authorized to access this protected resource',
        'Unauthorize Access',
        'AuthorizationError',
        httpStatusCode.UNAUTHORIZED
    );

    next(error);
};

export default isCurrentUser;
