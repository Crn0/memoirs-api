import asyncHandler from 'express-async-handler';
import Comment from '../../../models/commentSchema.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';

const comments = asyncHandler(async (req, res, _) => {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId });

    res.status(200).json({ comments });
});

const comments_target = asyncHandler(async (req, res, _) => {
    const { postId, commentId } = req.params;
    const comment = await Comment.findOne({ _id: commentId, post: postId });

    if (comment === null) {
        throw new APIError(
            'comment does not exist',
            'NOT FOUND',
            'RESOURCE ERROR',
            httpStatusCode.NOT_FOUND
        );
    }

    res.status(200).json({ comment });
});

export default {
    comments,
    comments_target,
};
