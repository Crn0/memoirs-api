import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';


const posts = asyncHandler(async (req, res, _) => {

    res.json({
        message: 'GET: post list'
    });
})

const posts_detail = asyncHandler(async (req, res, _) => {
    
    res.json({
        message: `GET: post detail ${req.params.postId}`
    });
})

export default {
    posts,
    posts_detail,
};