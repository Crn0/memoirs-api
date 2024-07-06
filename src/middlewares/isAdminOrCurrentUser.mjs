import APIError from "../helpers/errors/apiError.mjs";
import httpStatusCode from "../constants/httpStatusCode.mjs";

const isCurrentUser = (req, res, next) => {
    const { userId } = req.params;
    const { user } = req;    
    if(user._id === userId) {
        next();

        return;
    };

    const error = new APIError('Unauthorize Access', 'You don\'t have authorization to continue this action', 'AuthorizationError', httpStatusCode.UNAUTHORIZED)
    
    next(error);
}

export default isCurrentUser;