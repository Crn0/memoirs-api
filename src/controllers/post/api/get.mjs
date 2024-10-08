import asyncHandler from 'express-async-handler';
import Post from '../../../models/postSchema.mjs';
import Comment from '../../../models/commentSchema.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';

const posts = asyncHandler(async (req, res, _) => {
    const { limit, sortBy } = req.query;
    const sortKey =
        sortBy
            ?.split(/[x^+-]/)
            ?.join('')
            ?.trim() || 'title';
    const sortOrder = sortBy?.includes('-') ? -1 : 1;

    if (req.user?.membership === 'Admin') {
        const adminPosts = await Post.find()
            .limit(limit || 10)
            .populate('author', 'firstName lastName username')
            .populate({
                path: 'tags',
                select: 'name',
                options: { sort: { name: 1 } },
            })
            .sort({ [sortKey]: sortOrder });
        const adminTotal = await Post.countDocuments().exec();

        res.json({
            posts: adminPosts,
            total: adminTotal,
            limit: Number(limit) || 10,
        });
        return;
    }

    const posts = await Post.find({
        $or: [{ author: req.user?._id }, { isPrivate: false }],
    })
        .limit(limit || 10)
        .populate('author', 'firstName lastName username')
        .populate({
            path: 'tags',
            select: 'name',
            options: { sort: { name: 1 } },
        })
        .sort({ [sortKey]: sortOrder });
    const total = await Post.countDocuments().exec();

    res.status(httpStatusCode.OK).json({
        posts,
        total,
        limit: Number(limit) || 10,
    });
});

const posts_author = asyncHandler(async (req, res, _) => {
    const { limit, sortBy } = req.query;
    const sortKey =
        sortBy
            ?.split(/[x^+-]/)
            ?.join('')
            ?.trim() || 'title';
    const sortOrder = sortBy?.includes('-') ? -1 : 1;

    const posts = await Post.find({ author: req.user?._id })
        .limit(limit || 10)
        .populate('author', 'firstName lastName username')
        .populate({
            path: 'tags',
            select: 'name',
            options: { sort: { name: 1 } },
        })
        .sort({ [sortKey]: sortOrder });

    const total = await Post.find({author: req?.user._id}).exec();

    res.status(httpStatusCode.OK).json({
        posts,
        total,
        limit: Number(limit) || 10,
    });
});

const posts_detail = asyncHandler(async (req, res, _) => {
    const { postId } = req.params;
    const id = req.user?._id;

    if (req.user?.membership === 'Admin') {
        const post = await Post.findById(postId)
            .populate('author', 'firstName lastName username')
            .populate('tags', '_id name', null, { sort: { name: 1 } })
            .populate('comments')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'firstName lastName username'
                }
            });
        
        
        if (post === null) {
            throw new APIError(
                'post does not exist',
                'NOT FOUND',
                'RESOURCE ERROR',
                httpStatusCode.NOT_FOUND
            );
        }

        res.status(httpStatusCode.OK).json({ post });
        
        return;
    }

    const post = await Post.findOne({
        $and: {
            _id: postId,
            $or: [{ author: id }, { isPrivate: false }],
        },
    })
        .populate('author', 'firstName lastName username')
        .populate('tags', '_id name', null, { sort: { name: 1 } })
        .populate('comments')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'firstName lastName username'
            }
        });

        
    if (post === null) {
        throw new APIError(
            'post does not exist',
            'NOT FOUND',
            'RESOURCE ERROR',
            httpStatusCode.NOT_FOUND
        );
    }

    res.status(httpStatusCode.OK).json({
        post,
    });
});

export default {
    posts,
    posts_author,
    posts_detail,
};
