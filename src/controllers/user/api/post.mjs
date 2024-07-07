import asyncHandler from 'express-async-handler';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../../../models/userModel.mjs';
import AuthenticateError from '../../../helpers/errors/authError.mjs';
import formConstants from '../../../constants/formConstants.mjs';
import { isUsernameExist, isNotEmpty, isEmailExist, isValidEmail, isPasswordMatch } from '../../../helpers/validators/signupValidators.mjs';
import FormError from '../../../helpers/errors/formError.mjs';
import generateAndSendToken from '../../../helpers/security/generateAndSendToken.mjs';


const users_signup = [
    body(formConstants.FIRST_NAME)
    .trim()
    .custom(isNotEmpty)
    .withMessage('firstName must not be empty')
    .escape(),
    body(formConstants.LAST_NAME)
    .trim()
    .custom(isNotEmpty)
    .withMessage('lastName must not be empty')
    .escape(),
    body(formConstants.USERNAME)
    .trim()
    .custom(isNotEmpty)
    .withMessage('username must not be empty')
    .custom(isUsernameExist)
    .escape(),
    body(formConstants.EMAIL)
    .trim()
    .custom(isValidEmail)
    .withMessage('invalid email')
    .custom(isEmailExist)
    .escape(),
    body(formConstants.PWD)
    .trim()
    .custom((value) => (value.length > 0))
    .withMessage('password must not be empty')
    .escape(),
    body(formConstants.CONFIRM_PWD)
    .trim()
    .custom(isPasswordMatch)
    .withMessage('password does not match')
    .escape(),
    asyncHandler( async (req, res, next) => {
        const errors = validationResult(req);
        const { firstName, lastName, username, email, password} = req.body;

        if(!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message , path: field } = err;

                return {
                    type,
                    field,
                    message,
                }
            });
            const error = new FormError('Validation failed. Invalid form inputs', errorFields)

            next(error)
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            username,  
            password: hashedPassword,
            // membership: 'Admin'
        });
    
        res.status(201).json({
            message: 'successful sign up. please login.'
        })
    })
];

const users_login = [
    body(formConstants.EMAIL)
    .trim()
    .custom(isValidEmail)
    .withMessage('invalid email')
    .escape(),
    body(formConstants.PWD)
    .trim()
    .custom((value) => (value.length > 0))
    .withMessage('password must not be empty')
    .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message , path: field } = err;

                return {
                    type,
                    field,
                    message,
                }
            });
            const error = new FormError('Validation failed. please submit the correct format', errorFields)

            next(error)
            return;
        }

        next();
    }),
    (req, res, next) => {
    
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
        })(req, res, next);
    },
    asyncHandler(async (req, res) => {
        const { user } = req;
        // remove the password in the user object;
        // eslint-disable-next-line no-unused-vars
        const { password: removeThis, ...currentUser} = user;

        generateAndSendToken(res, currentUser);
    }),
];

const users_like_comment = asyncHandler(async (req, res, _) => {
    const { userId } = req.params;
    const { commentId } = req.params;

    const user = await User.findByIdAndUpdate(userId, {
        $push: {
            likeComments: commentId
        }
    }, { new: true })

    res.status(200).json({
        user,
    })

});

export default {
    users_signup,
    users_login,
    users_like_comment,
};
