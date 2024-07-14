import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Comment from '../../../models/commentSchema.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';


const comments_delete = asyncHandler(async (req, res, _) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const findComment = await Comment.findOne({ $and: { _id: commentId, author: userId, isDeleted: false } });

    if (findComment === null) {
        throw new APIError('comment does not exist', 'NOT FOUND', 'RESOURCE ERROR', httpStatusCode.NOT_FOUND);
    };

    await Comment.findOneAndUpdate({ _id: commentId, author: userId }, { isDeleted: true }, { new: true });

    res.status(204).json({});
});
   
    


const comments_delete_all  = asyncHandler(async (req, res, _) => {
    const { postId } = req.params;

    res.json({
        message: `DELETE: delete all comments. postID: ${postId}.`
    });
});

const comments_unlike = asyncHandler(async (req, res, _) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const oldComment = await Comment.findOne({ $and: { _id: commentId, isDeleted: false } });
    const likeUsers = new Set(oldComment.likes.users.map(id => id.toString()));
    
    if (oldComment === null) {
        throw new APIError('comment does not exist', 'NOT FOUND', 'RESOURCE ERROR', httpStatusCode.NOT_FOUND);
    } 

    if(likeUsers.has(userId)) {
        likeUsers.delete(userId)
        oldComment.likes.users = likeUsers
    } 
    
    oldComment.likes.count = oldComment.likes.users.length;
    
    await Comment.findByIdAndUpdate(commentId, oldComment, { new: true })
    
    res.status(200).json({})
});

export default {
    comments_delete,
    comments_delete_all,
    comments_unlike
};