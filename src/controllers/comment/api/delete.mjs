import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';
import Comment from '../../../models/commentSchema.mjs';


const comments_delete  = asyncHandler(async (req, res, _) => {
    const { postId, commentId } = req.params;

    res.json({
        message: `DELETE: delete a comment. commentID: ${commentId}. postID: ${postId}.`
    });
});

const comments_delete_all  = asyncHandler(async (req, res, _) => {
    const { postId } = req.params;

    res.json({
        message: `DELETE: delete all comments. postID: ${postId}.`
    });
});

export default {
    comments_delete,
    comments_delete_all
};