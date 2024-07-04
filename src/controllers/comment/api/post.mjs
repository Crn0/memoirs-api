import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';
import Comment from '../../../models/commentSchema.mjs';

const comments_new = asyncHandler(async (req, res, _) => {
    const { postId } = req.params;

    res.json({
        message: `POST: post a comment. postID: ${postId}.`
    });
});

const comments_reply = asyncHandler(async (req, res, _) => {
    const { postId, commentId } = req.params;

    res.json({
        message: `POST: reply to a comment. commentID: ${commentId}. postID: ${postId}.`
    });
});

export default {
    comments_new,
    comments_reply
};