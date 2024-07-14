import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Comment from '../../../models/commentSchema.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';
import formConstants from '../../../constants/formConstants.mjs';
import { isNotEmpty } from '../../../helpers/validators/validators.mjs';
import FormError from '../../../helpers/errors/formError.mjs';

const comments_update = [
    body(formConstants.BODY)
    .trim()
    .custom(isNotEmpty)
    .withMessage('Message body must not be empty'),
    asyncHandler(async (req, res, _) => {
        const { postId } = req.params;
        const userId = req.user._id;
        const errors = validationResult(req);

        const { body } = req.body;

        if(!errors.isEmpty()) {

            const errorFields = errors.array().map((err) => {
                const { type, msg: message , path: field } = err;

                return {
                    type,
                    field,
                    message,
                }
            });
            
            throw new FormError('Validation failed. Invalid form inputs', errorFields);
        }
    
        const comment = await Comment.create({
                body,
                author: userId,
                post: postId,
        });
    
        res.status(201).json({ comment });
    })
];

const comments_like = asyncHandler(async (req, res, _) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const oldComment = await Comment.findOne({ $and: { _id: commentId, isDeleted: false } });
    const likeUsers = new Set(oldComment?.likes?.users?.map?.(id => id?.toString()));


    if (oldComment === null) {
        throw new APIError('comment does not exist', 'NOT FOUND', 'RESOURCE ERROR', httpStatusCode.NOT_FOUND);
    }

    if(likeUsers.has(userId)) {
        likeUsers.delete(userId)
        oldComment.likes.users = likeUsers
    } 

    oldComment.likes.count = oldComment.likes.users.length;


    const newComment = await Comment.findByIdAndUpdate(commentId, oldComment, { new: true } )


    res.status(201).json({ comment: newComment })
});

export default {
    comments_update,
    comments_like,
};