import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.mjs';
import { JWT_SECRET } from "../constants/env.mjs";


passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email }).exec();
    
            if (!user) return done(null, false, { message: 'Incorrect email' });
    
            const match = await bcrypt.compare(password, user.password);
    
            if (!match) return done(null, false, { message: 'Incorrect password' });
    
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
))
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        },
        (token, done) => {
            try {
                return done(null, token)
            } catch (error) {
                
            
                return done(error)
            }
        }
    )
)


export default passport;

