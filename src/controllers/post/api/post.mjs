import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';


const posts_new = asyncHandler(async (req, res, _) => {
    
    res.json({
        message: `POST: create post `
    });
})

export default {
    posts_new
};