import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXP } from '../../constants/env.mjs';
import APIError from '../errors/apiError.mjs';

const generateAndSendToken = (res, user) => {
    return jwt.sign(
        user,
        JWT_SECRET,
        {
            expiresIn: JWT_EXP,
        },
        (err, token) => {
            if (err) {
                throw new APIError('Generate token failed', err.message);
            }

            res.status(200).json({
                user,
                token,
            });
        }
    );
};

export default generateAndSendToken;
