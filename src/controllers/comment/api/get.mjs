import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';
import Comment from '../../../models/commentSchema.mjs';

const comments = asyncHandler(async (req, res, _) => {
    const { postId } = req.params;

    res.json({
        message: `GET: all comments. postID: ${postId}.`
    });
});

const comments_target = asyncHandler(async (req, res, _) => {
    const { postId, commentId } = req.params;

    res.json({
        message: `GET: single post comment. messageID: ${commentId}. postID: ${postId}.`
    });
});

export default {
    comments,
    comments_target,
};