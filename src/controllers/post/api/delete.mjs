import 'dotenv/config'
import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';
import Cloudinary from '../../../helpers/media/cloudinary.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';

const posts_delete = asyncHandler(async (req, res, _) => {
    const { postId } = req.params;
    const userId = req.user._id

    const post = await Post.findOneAndDelete({ $and: { _id: postId, author: userId }})

    if(post === null) {
        res.status(httpStatusCode.NO_CONTENT).json({});
        return
    }

    await Cloudinary.destroy(post.cover.cloudinary_id)
    await Cloudinary.destroyFolder(`${process.env.CLOUDINARY_BLOG_ROOT_FOLDER}/${req.user.username}/${post.id}`);

    res.status(httpStatusCode.NO_CONTENT).json({});
})

export default {
    posts_delete,
};