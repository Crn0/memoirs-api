import asyncHandler from 'express-async-handler';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../../../models/userSchema.mjs';
import AuthenticateError from '../../../helpers/errors/authError.mjs';
import formConstants from '../../../constants/formConstants.mjs';
import {
    isUsernameExist,
    isNotEmpty,
    isEmailExist,
    isPasswordMatch,
} from '../../../helpers/validators/validators.mjs';
import FormError from '../../../helpers/errors/formError.mjs';
import generateAndSendToken from '../../../helpers/security/generateAndSendToken.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';
import { JWT_EXP, JWT_SECRET } from '../../../constants/env.mjs';

const users_signup = [
    body(formConstants.FIRST_NAME)
        .trim()
        .custom(isNotEmpty)
        .withMessage('First name must not be empty'),
    body(formConstants.LAST_NAME)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Last name must not be empty'),
    body(formConstants.USERNAME)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Username must not be empty')
        .custom(isUsernameExist)
        .custom((val) => {
            const regex = /^[{a-zA-Z}]{1,}\d{0,}[{a-zA-Z}]{0,}$/g;
            // https://regexr.com/83re3
            return regex.test(val)
        })
        .withMessage('Username must not contain special characters.')
        .escape(),
    body(formConstants.EMAIL)
        .trim()
        .isEmail()
        .withMessage('The email is not a valid email address')
        .custom(isEmailExist)
        .escape(),
    body(formConstants.PWD)
        .trim()
        .custom((value) => value.length > 0)
        .withMessage('Password must not be empty'),
    body(formConstants.CONFIRM_PWD)
        .trim()
        .custom(isPasswordMatch)
        .withMessage('Password does not match'),
    asyncHandler(async (req, res, _) => {
        const errors = validationResult(req);
        const { firstName, lastName, username, email, password } = req.body;

        if (!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message, path: field } = err;

                return {
                    type,
                    field,
                    message,
                };
            });
            throw new FormError(
                'Validation failed. Invalid form inputs',
                errorFields
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
        });

        const token = jwt.sign(user.toJSON(), JWT_SECRET, { expiresIn: JWT_EXP});

        res.status(httpStatusCode.CREATED).json({user, token});
    }),
];

const users_login = [
    body(formConstants.EMAIL)
        .trim()
        .isEmail()
        .withMessage('The email is not a valid email address')
        .escape(),
    body(formConstants.PWD)
        .trim()
        .custom((value) => value.length > 0)
        .withMessage('Password must not be empty')
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message, path: field } = err;

                return {
                    type,
                    field,
                    message,
                };
            });
            throw new FormError(
                'Validation Failed',
                errorFields
            );
        }

        next();
    }),
    (req, res, next) => {
        return passport.authenticate(
            'login',
            { session: false },
            (err, user, info) => {
                if (err) {
                    next(new AuthenticateError(err.message));
                }

                if (!user || info) {
                    next(new AuthenticateError(
                        'Authentication failed',
                        info.message
                    ));
                }

                // remove the password in the user object;
                // eslint-disable-next-line no-unused-vars
                const { password: removeThis, ...currentUser } = user;

                generateAndSendToken(res, currentUser);
            }
        )(req, res, next);
    },
];

const users_authors_signup =  [
    body(formConstants.FIRST_NAME)
        .trim()
        .custom(isNotEmpty)
        .withMessage('First name must not be empty'),
    body(formConstants.LAST_NAME)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Last name must not be empty'),
    body(formConstants.USERNAME)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Username must not be empty')
        .custom(isUsernameExist)
        .custom((val) => {
            const regex = /^[{a-zA-Z}]{1,}\d{0,}[{a-zA-Z}]{0,}$/g;
            // https://regexr.com/83re3
            return regex.test(val)
        })
        .withMessage('Username must not contain special characters')
        .escape(),
    body(formConstants.EMAIL)
        .trim()
        .isEmail()
        .withMessage('The email is not a valid email address')
        .custom(isEmailExist)
        .escape(),
    body(formConstants.PWD)
        .trim()
        .custom((value) => value.length > 0)
        .withMessage('Password must not be empty'),
    body(formConstants.CONFIRM_PWD)
        .trim()
        .custom(isPasswordMatch)
        .withMessage('Password does not match'),
    body(formConstants.AUTH_PWD)
        .trim()
        .custom((val) => {

            return val === process.env.AUTH_PWD;
        })
        .withMessage('Access Denied: Not authorized.'),
    asyncHandler(async (req, res, _) => {
        const errors = validationResult(req);
        const { firstName, lastName, username, email, password } = req.body;
        console.log(req.body)
        if (!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message, path: field } = err;

                return {
                    type,
                    field,
                    message,
                };
            });
            throw new FormError(
                'Validation failed. Invalid form inputs',
                errorFields
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            membership: "Author",
        });

        const token = jwt.sign(user.toJSON(), JWT_SECRET, { expiresIn: JWT_EXP});

        res.status(httpStatusCode.CREATED).json({user, token});
    }),
];

const users_authors_login = [
    (req, res, next) => {
        next()
    },
    body(formConstants.EMAIL)
        .trim()
        .isEmail()
        .withMessage('The email is not a valid email address')
        .escape(),
    body(formConstants.PWD)
        .trim()
        .custom((value) => value.length > 0)
        .withMessage('Password must not be empty')
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message, path: field } = err;

                return {
                    type,
                    field,
                    message,
                };
            });
            throw new FormError(
                'Validation Failed',
                errorFields
            );
        }

        next();
    }),
    (req, res, next) => {
        return passport.authenticate(
            'author_login',
            { session: false },
            (err, user, info) => {
                if (err) {
                    next(new AuthenticateError(err.message));
                }

                if (!user || info) {
                    next(new AuthenticateError(
                        'Authentication failed',
                        info.message
                    ));
                }

                // remove the password in the user object;
                // eslint-disable-next-line no-unused-vars
                const { password: removeThis, ...currentUser } = user;

                generateAndSendToken(res, currentUser);
            }
        )(req, res, next);
    },
];

const users_like_comment = asyncHandler(async (req, res, _) => {
    const { userId } = req.params;
    const { commentId } = req.params;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $push: {
                likeComments: commentId,
            },
        },
        { new: true }
    );

    res.status(httpStatusCode.OK).json({
        user,
    });
});

export default {
    users_signup,
    users_authors_signup,
    users_login,
    users_authors_login,
    users_like_comment,
};
