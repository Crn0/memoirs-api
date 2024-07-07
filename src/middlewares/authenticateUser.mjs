import passport from "passport";
import AuthenticateError from "../helpers/errors/authError.mjs";

const authUser = (req, res, next) => {
    
    return passport.authenticate('login', (err, user, info) => {
        if(err) {
            next(err);
    
            return;
        }
    
        if(!user) {
            const error = new AuthenticateError('Authentication failed', info.message)
    
            next(error)
    
            return;
        }
    
        req.user = user.toJSON();
        
        next();
    });
};

export default authUser;