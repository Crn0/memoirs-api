import passport from 'passport';
import AuthenticateError from '../errors/authError.mjs';

const authenticate = (req,next) => passport.authenticate('local', (err, user, info) => {
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


export default {
    authenticate
};