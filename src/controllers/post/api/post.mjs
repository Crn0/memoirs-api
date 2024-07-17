import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Post from '../../../models/postSchema.mjs';
import Tag from '../../../models/tagSchema.mjs';
import FormError from '../../../helpers/errors/formError.mjs';
import formConstants from '../../../constants/formConstants.mjs';
import {
    isNotEmpty,
    validFileType,
} from '../../../helpers/validators/validators.mjs';
import Cloudinary from '../../../helpers/media/cloudinary.mjs';

/**
    TODO:
        Authenticate route DONE
        Validate inputs DONE
        Implement post creation DONE
        implement cloudinary upload
 */
const posts_new = [
    (req, res, next) => {
        if (!Array.isArray(req.body.tags)) {
            req.body.tags =
                typeof req.body.tags === 'undefined' ? [] : [req.body.tags];
        }

        next();
    },
    body(formConstants.COVER)
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
    body(formConstants.TITLE)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Title must not be empty')
        .escape(),
    body(formConstants.BODY)
        .trim()
        .custom(isNotEmpty)
        .withMessage('Post body must not be empty')
        .escape(),
    body(formConstants.STATUS).trim().escape(),
    body(`${formConstants.TAGS}.*`).trim().escape(),
    asyncHandler(async (req, res, _) => {
        const { title, body, status, tags } = req.body;
        const errors = validationResult(req);

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
        /**
         * make sure the tag is created before creating a post
         * in your frontend make an post request on the /tags to create it
         **/
        const tagList = await Tag.find({ name: tags });

        const post = await Post({
            title,
            body,
            author: req.user._id,
            tags: tagList,
            isPrivate: status !== '' ? status : false,
        });

        if (req.file) {
            const image = await Cloudinary.upload(
                req.file.path,
                req.user.username,
                post.id
            );

            post.cover.url = image.url;
            post.cover.cloudinary_id = image.public_id;
        }

        await post.save();

        res.status(201).json({ post });
    }),
];

export default {
    posts_new,
};
