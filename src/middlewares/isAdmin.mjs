import APIError from "../helpers/errors/apiError.mjs";
import httpStatusCode from "../constants/httpStatusCode.mjs";

const isAdmin = (req, res, next) => {
    
    if(req.user.membership === 'Admin') {

        req.isAdmin = true;
        
        next();

        return;
    };

    const error = new APIError('Unauthorize Access', 'You don\'t have authorization to view this page', 'AuthorizationError', httpStatusCode.UNAUTHORIZED)
    
    next(error);
}

export default isAdmin;