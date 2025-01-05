import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/userSchema.mjs';
import { JWT_SECRET } from '../constants/env.mjs';

passport.use(
    'author_login',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (email, password, done) => {
            try {
                // CONVERT MONGOOSE OBJECT TO JS
                const user = await User.findOne({ email }).lean().exec();

                if (!user)
                    return done(null, false, { message: 'Invalid email or password' });

                const match = await bcrypt.compare(password, user.password);

                if (!match)
                    return done(null, false, { message: 'Invalid email or password' });
                
                if (user.membership.toLowerCase() !== 'author' && user.membership.toLowerCase() !== 'admin')
                    return done(null, false, { message: 'Access Denied: Not authorized.' });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        },
    )
);
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (email, password, done) => {
            try {
                // CONVERT MONGOOSE OBJECT TO JS
                const user = await User.findOne({ email }).lean().exec();

                if (!user)
                    return done(null, false, { message: 'Invalid email or password' });

                const match = await bcrypt.compare(password, user.password);

                if (!match)
                    return done(null, false, { message: 'Invalid email or password' });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        },
        (token, done) => {
            try {
                return done(null, token);
            } catch (error) {
                return done(error);
            }
        }
    )
);

export default passport;
