import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';
import Comment from '../../../models/commentSchema.mjs';

const comments_update = asyncHandler(async (req, res, _) => {
    const { postId, commentId } = req.params;

    res.json({
        message: `PUT: update a comment. commentID: ${commentId}. postID: ${postId}.`
    });
});

export default {
    comments_update
};