import APIError from "../helpers/errors/apiError.mjs";
import httpStatusCode from "../constants/httpStatusCode.mjs";

const attachToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']?.trim?.();
    
    if(typeof bearerHeader !== 'undefined' && bearerHeader.length > 0) {

        const bearer = bearerHeader.split('=');
        const bearerToken = bearer[1];
            req.token = bearerToken;

            next();
            
            return
        }
        
        const error = new APIError('Unauthorize Access', 'You don\'t have authorization to view this page', 'AuthorizeError', httpStatusCode.UNAUTHORIZED)
    

        next(error);
        
};

export default attachToken;