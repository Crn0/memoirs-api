import passport from "passport";
import APIError from "../helpers/errors/apiError.mjs";
import httpStatusCode from "../constants/httpStatusCode.mjs";

const attachUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if(err) {
            const error = new APIError('Internal Server Error', info?.message || 'Invalid signature', 'JsonWebTokenError', httpStatusCode.UNAUTHORIZED)
            
            next(error);
            return;
        }

        if(user) {

            req.login(user, { session: false });
            
            next();
            return;
        } 
        
        next();
    })(req, res, next)
}

export default attachUser;