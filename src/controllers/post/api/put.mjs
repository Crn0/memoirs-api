import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';


const posts_update = asyncHandler(async (req, res, _) => {
    
    res.json({
        message: `PUT: update post ${req.params.postId}`
    });
});

export default {
    posts_update
};