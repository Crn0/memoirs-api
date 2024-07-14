import passport from "passport";
import APIError from "../helpers/errors/apiError.mjs";
import httpStatusCode from "../constants/httpStatusCode.mjs";

const verifyToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if(err || !user) {

            const error = new APIError('You are not authenticated. Please login to continue', info.message || 'Invalid signature', 'JsonWebTokenError', httpStatusCode.UNAUTHORIZED)
            next(error);
            return
        }
        
        req.login(user, { session: false });
        
        next()

    })(req, res, next)
}

export default verifyToken;