import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Post from '../../../models/postSchema.mjs';
import Tag from '../../../models/tagSchema.mjs';
import formName from '../../../constants/formConstants.mjs';
import {
    validFileType,
    isNotEmpty,
} from '../../../helpers/validators/validators.mjs';
import FormError from '../../../helpers/errors/formError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';
import Cloudinary from '../../../helpers/media/cloudinary.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';

/**
    TODO:
        Authenticate route  DONE
        Validate inputs DONE
        Implement post update DONE
        implement cloudinary update
        implement cover image update
 */
const posts_update = [
    (req, res, next) => {
        if(typeof req.body.tags !== 'undefined') {
            req.body.tags = JSON.parse(req.body.tags);
        }

        if(!Array.isArray(req.body.tags)) {
            req.body.tags =
                typeof req.body.tags === 'undefined' ? [] : [req.body.tags];
        }

        next();
    },
    body(formName.TITLE)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Title must not be empty'),
    body(formName.BODY)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Post body must not be empty'),
    body(formName.STATUS).trim().escape(),
    body(`${formName.TAGS}.*`).trim(),
    asyncHandler(async (req, res, _) => {
        const { user } = req;
        const { postId } = req.params;
        const errors = validationResult(req);
        const { title, body, status, tags } = req.body;
        
        if (!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message, path: field } = err;

                return {
                    type,
                    field,
                    message,
                };
            });

            throw new FormError(
                'Validation failed. Invalid form inputs',
                errorFields
            );
        }

        const oldPost = await Post.findById(postId);
        
        if (oldPost === null) {
            throw new APIError(
                'post does not exist',
                'NOT FOUND',
                'RESOURCE ERROR',
                httpStatusCode.NOT_FOUND
            );
        }

        let tagList = await Tag.find({ name: tags });
        const tagsName = new Set(tagList.map((tag) => tag.name))
        const tagsToInsert = tags.reduce((prev, name) => {
            if (!tagsName.has(name)) {
                if(Array.isArray(prev)) {
                    return [...prev, { name }]
                } else {
                    if (name.trim() !== "") return [{ name }];

                    return null
                }
            }
        }, {});

        if (tagsToInsert?.length) {
            const createTags = await Tag.insertMany(tagsToInsert);

            tagList = [...tagList, ...createTags];
        }

        const postUpdate = Post({
            title,
            body,
            status,
            tags: tagList,
            _id: postId,
            author: user._id,
        });

        if (oldPost.cover.cloudinary_id) {
            await Cloudinary.destroy(oldPost.cover.cloudinary_id)
        }

        if (req.file) {
            const image = await Cloudinary.upload(req.file.path, req.user.username, postId);

            postUpdate.cover.url = image.url;
            postUpdate.cover.cloudinary_id = image.public_id;
        } 

        const post = await Post.findByIdAndUpdate(postId, postUpdate, {
            new: true,
        }).populate('author', 'firstName lastName username');

        if (post.tags.length) {
            await post.populate('tags', 'name');
        }

        res.status(httpStatusCode.OK).json({ post });
    }),
];

const posts_status = [
    body(formName.STATUS)
    .trim()
    .custom((val) => {
        if (val === 'true') return true;
        if (val === 'false') return true;

        return false;
    })
    .withMessage('status must be a boolean')
    .escape(),
    asyncHandler(async (req, res, _) => {
        const { postId } = req.params;
        const { status } = req.body;
        const errors = validationResult(req);
        console.log(req.body)

        if (!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message, path: field } = err;

                return {
                    type,
                    field,
                    message,
                };
            });

            throw new FormError(
                'Validation failed. Invalid form inputs',
                errorFields
            );
        }

        const post = await Post.findByIdAndUpdate(postId, {
            isPrivate: (() => {
                if (status === 'true') return false;
                if (status === 'false') return true;
            })()
        }, {
            new: true,
        });

        res.status(httpStatusCode.OK).json({ post });
    }),
]

export default {
    posts_update,
    posts_status
};
