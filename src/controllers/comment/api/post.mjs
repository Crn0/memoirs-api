import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Post from '../../../models/postSchema.mjs';
import Comment from '../../../models/commentSchema.mjs';
import formConstants from '../../../constants/formConstants.mjs';
import { isNotEmpty } from '../../../helpers/validators/validators.mjs';
import FormError from '../../../helpers/errors/formError.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';

const comments_new = [
    body(formConstants.BODY)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Message body must not be empty'),
    asyncHandler(async (req, res, _) => {
        const { user } = req;
        const { postId } = req.params;
        const errors = validationResult(req);

        const { body } = req.body;

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

        const comment = await Comment.create({
            body,
            author: user._id,
            post: postId,
        });

        res.status(201).json({ comment });
    }),
];

const comments_reply = [
    body(formConstants.BODY)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Message body must not be empty')
        .escape(),
    body(formConstants.IS_REPLY).trim().escape(),

    asyncHandler(async (req, res, _) => {
        const { user } = req;
        const { postId, commentId } = req.params;
        const errors = validationResult(req);

        let { body, isReply } = req.body;

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

        if (isReply !== true) {
            isReply = true;
        }

        const commentReply = await Comment.create({
            isReply,
            body,
            author: user._id,
            post: postId,
        });

        const comment = await Comment.findOneAndUpdate(
            { _id: commentId, isDeleted: false },
            { $push: { replies: commentReply.id } },
            { new: true }
        ).populate('replies');

        if (comment === null) {
            throw new APIError(
                'comment does not exist',
                'NOT FOUND',
                'RESOURCE ERROR',
                httpStatusCode.NOT_FOUND
            );
        }

        res.status(201).json({ comment, repLen: comment.replies.length });
    }),
];

export default {
    comments_new,
    comments_reply,
};
