import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';
import Cloudinary from '../../../helpers/media/cloudinary.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';

const posts_delete = [
    asyncHandler(async (req, res, next) => {
        const { postId } = req.params;
        const userId = req.user._id;
        
        if(req.user.membership === 'Admin') {
            return next();
        }
    
        const post = await Post.findOneAndDelete({
            $and: { _id: postId, author: userId },
        });
    
        if (post === null) {
            throw new APIError(
                'post does not exist',
                'NOT FOUND',
                'RESOURCE ERROR',
                httpStatusCode.NOT_FOUND
            );
        }
    
        if(post.cover.cloudinary_id !== '' && post.cover.url) {
            await Cloudinary.destroy(post.cover.cloudinary_id);
            await Cloudinary.destroyFolder(
                `${process.env.CLOUDINARY_BLOG_ROOT_FOLDER}/${req.user.username}/${post.id}`
            );
        }
    
        res.status(httpStatusCode.NO_CONTENT).json({});
    }),
    asyncHandler(async (req, res, _) => {
        const { postId } = req.params;
        const post = await Post.findOneAndDelete({ _id: postId }).populate('author', 'username');

        if (post === null) {
            throw new APIError(
                'post does not exist',
                'NOT FOUND',
                'RESOURCE ERROR',
                httpStatusCode.NOT_FOUND
            );
        }

        if(post.cover.cloudinary_id !== '' && post.cover.url) {
            await Cloudinary.destroy(post.cover.cloudinary_id);
            await Cloudinary.destroyFolder(
                `${process.env.CLOUDINARY_BLOG_ROOT_FOLDER}/${post.author.username}/${post.id}`
            );
        }
    
        res.status(httpStatusCode.NO_CONTENT).json({});
    })
];

export default {
    posts_delete,
};
