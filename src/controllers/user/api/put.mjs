import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import formConstants from '../../../constants/formConstants.mjs';
import User from '../../../models/userModel.mjs';
import FormError from '../../../helpers/errors/formError.mjs';
import { isNotEmpty } from '../../../helpers/validators/signupValidators.mjs';

const users_update = [
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
    body('username')
    .trim()
    .custom(isNotEmpty)
    .withMessage('username must not be empty')
    .custom(async (value, { req }) => {
        const user = await User.findOne({ username: value }).exec();

        if(!user) return Promise.resolve();
        if(req.user.username !== value && user.username === value) return Promise.reject('username already in use');

        return Promise.resolve();
    })
    .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const { userId } = req.params;
        const { firstName, lastName, username } = req.body;

        if(!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message , path: field } = err;

                return {
                    type,
                    field,
                    message,
                }
            });
            const error = new FormError('Validation failed', errorFields)

            next(error)
            return;
        }

        const user = await User.findByIdAndUpdate(userId, { username, firstName, lastName }, { new: true })

        res.status(200).json({
            user,
        })
    })
];

export default {
    users_update
};