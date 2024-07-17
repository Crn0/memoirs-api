import asyncHandler from 'express-async-handler';
import User from '../../../models/userSchema.mjs';
import Post from '../../../models/postSchema.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';


const users_delete = asyncHandler(async (req, res, _) => {
    const userId = req.user._id;
    /**
     * Delete all the user post
     * Delete all the user comments
     * 
     * Delete all the user's posts comments (if cannot implement this don't let the user to delete their account)
     * 
     */

    // await User.findByIdAndDelete(userId);
    // await Post.deleteMany({ author: userId });
    // await Comment.deleteMany()

    res.status(204).json({
        message: 'this is not implemented'
    });
});

const users_bookmark = asyncHandler(async (req, res, _) => {
    const { postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if(post === null) {
        throw new APIError('post does not exist', 'NOT FOUND', 'RESOURCE ERROR', httpStatusCode.NOT_FOUND);
    }

    await User.findByIdAndUpdate(userId, { $pull: { bookmarks: postId }}, { new: true });

    res.status(httpStatusCode.NO_CONTENT).json({});
})


export default {
    users_delete,
    users_bookmark,
};
    