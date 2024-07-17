import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/userSchema.mjs';
import { JWT_SECRET } from '../constants/env.mjs';

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
                    return done(null, false, { message: 'Incorrect email' });

                const match = await bcrypt.compare(password, user.password);

                if (!match)
                    return done(null, false, { message: 'Incorrect password' });

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
