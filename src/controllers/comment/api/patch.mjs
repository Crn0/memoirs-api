import asyncHandler from 'express-async-handler';
import Comment from '../../../models/commentSchema.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';

const comments_patch = asyncHandler(async (req, res, _) => {
    const { commentId } = req.params;
    const { field, value } = req.query;

    const patchComment = await Comment.findByIdAndUpdate(commentId, {
        [field]: value,
    });

    if (patchComment === null) {
        throw new APIError(
            'comment does not exist',
            'NOT FOUND',
            'RESOURCE ERROR',
            httpStatusCode.NOT_FOUND
        );
    }

    res.status(200).json({ comment: patchComment });
});

export default {
    comments_patch,
};
