import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import formConstants from '../../../constants/formConstants.mjs';
import Post from '../../../models/postSchema.mjs';
import User from '../../../models/userSchema.mjs';
import FormError from '../../../helpers/errors/formError.mjs';
import { isNotEmpty } from '../../../helpers/validators/validators.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';

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
    body(formConstants.USERNAME)
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
    asyncHandler(async (req, res, _) => {
        const { firstName, lastName, username} = req.body;
        const errors = validationResult(req);
        const userId = req.user._id;

        if(!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message , path: field } = err;

                return {
                    type,
                    field,
                    message,
                }
            });
            
            throw new FormError('Validation failed', errorFields);
        }

        const user = await User.findByIdAndUpdate(userId, { username, firstName, lastName }, { new: true })

        res.status(200).json({
            user,
        })
    })
];

const users_bookmark = [
    body(formConstants.POST_ID)
    .trim()
    .custom(isNotEmpty)
    .withMessage('Id must not be empty')
    .custom(val => {
        if(mongoose.isValidObjectId(val)) return true;

        return false
    })
    .withMessage('Invalid id')
    .escape(),

    asyncHandler(async (req, res, _) => {
        const { postId } = req.body
        const errors = validationResult(req);
        const userId = req.user._id;

        if(!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message , path: field } = err;

                return {
                    type,
                    field,
                    message,
                }
            });
            
            throw new FormError('Validation failed', errorFields);
        }

        const post = await Post.findById(postId);

        if(post === null) {
            throw new APIError('post does not exist', 'NOT FOUND', 'RESOURCE ERROR', httpStatusCode.NOT_FOUND);
        }

        await User.updateMany({}, { $unset: { likeComments: 1 } })

        const user = await User.findByIdAndUpdate(userId, { $push: { bookmarks: postId }}, { new: true, projection: '-password' });



        res.status(200).json({ user });
    })
];

export default {
    users_update,
    users_bookmark,
};