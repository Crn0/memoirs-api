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
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';
import Cloudinary from '../../../helpers/media/cloudinary.mjs';
import url from 'node:url';

/**
    TODO:
        Authenticate route  DONE
        Validate inputs DONE
        Implement post update DONE
        implement cloudinary update
        implement cover image update
 */
const posts_update = [
    body('image_url')
        .trim()
        .custom(isNotEmpty)
        .withMessage('Post image url must not be empty')
        .custom((val) => {
            const url = new URL(val);

            if (url.hostname !== 'res.cloudinary.com') return false;

            return true;
        })
        .withMessage('Invalid image url')
        .unescape(),
    body('image_id')
        .trim()
        .custom(isNotEmpty)
        .withMessage('Post image id must not be empty')
        .escape(),
    body(formName.COVER)
        .trim()
        .custom(validFileType)
        .withMessage(
            'The file extension is not supported. Please upload a file with one of the following extensions: .jpg, .jpeg, .png, .webp'
        )
        .custom((_, { req }) => {
            if (req.file?.size > 5242880) return false;

            return true;
        })
        .withMessage('File size exceeds the maximum limit')
        .escape(),
    body(formName.TITLE)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Title must not be empty')
        .escape(),
    body(formName.BODY)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Post body must not be empty')
        .escape(),
    body(formName.STATUS).trim().escape(),
    body(`${formName.TAGS}.*`).trim().escape(),
    asyncHandler(async (req, res, _) => {
        const { user } = req;
        const { postId } = req.params;
        const errors = validationResult(req);
        const { title, body, status, tags, image_url, image_id } = req.body;

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

        const tagList = await Tag.find({ name: tags });
        const postUpdate = Post({
            title,
            body,
            status,
            tagList,
            _id: postId,
            author: user._id,
        });

        if (req.file) {
            const image = await Cloudinary.update(req.file.path, image_id);

            postUpdate.cover.url = image.url;
            postUpdate.cover.cloudinary_id = image.public_id;
        } else {
            postUpdate.cover.url = image_url;
            postUpdate.cover.cloudinary_id = image_id;
        }

        const post = await Post.findByIdAndUpdate(postId, postUpdate, {
            new: true,
        });

        res.status(httpStatusCode.OK).json({ post });
    }),
];

export default {
    posts_update,
};
