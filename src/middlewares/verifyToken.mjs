import jwt from 'jsonwebtoken'
import APIError from "../helpers/errors/apiError.mjs";
import httpStatusCode from "../constants/httpStatusCode.mjs";
import { JWT_SECRET } from '../constants/env.mjs';


function verifyToken(req, res, next) {
    const { token } = req;

    jwt.verify(token, JWT_SECRET, (err, authData) => {
        if(err) {
            const error = new APIError('Expired or Invalid Token', 'You don\'t have authorization to view this page', 'AuthorizeError', httpStatusCode.UNAUTHORIZED)
            next(error);

            return;
        }
        
        req.user = authData;
    });

    next();

};

export default verifyToken;