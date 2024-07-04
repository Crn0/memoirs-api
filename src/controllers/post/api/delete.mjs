import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';

const posts_delete = asyncHandler(async (req, res, _) => {
    
    res.json({
        message: `DELETE: post delete ${req.params.postId}`
    });
})

export default {
    posts_delete,
};