import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Tag from "../../../models/tagSchema.mjs";
import formConstants from '../../../constants/formConstants.mjs';
import FormError from '../../../helpers/errors/formError.mjs';

const tags_new = [
    (req, res, next) => {
        if(!Array.isArray(req.body.tags)) {
            req.body.tags = typeof req.body.tags === 'undefined' ? [] : [ req.body.tags ]
        }

        next();
    },
    body(formConstants.TAGS)
    .trim()
    .custom((val) => val.length)
    .withMessage('tag name must not be empty')
    .custom((val) => {

        if(val.length > 4) {

            return false
        }

        return true;
    })
    .withMessage('maximum array length is 4')
    .escape(),

    asyncHandler(async (req, res, _) => {
        const { tags: nameList } = req.body;
        const tags = new Set(nameList)

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message , path: field } = err;

                return {
                    type,
                    field,
                    message,
                }
            });
            
            throw new FormError('Validation failed. Invalid form inputs', errorFields);
        };

        const existingTags = await Tag.find({}).sort({ name: 1 });
        const existingNames = new Set(existingTags.filter(tag => tag.name));
        const namesToCreate = [...tags]?.filter?.((val) => {
            if(existingNames.size === 0) return true;

            return existingNames.has(val)
        });
        const documentsToInsert = namesToCreate?.map?.((name) => ({ name }));
        // there is no document to insert
        // find the tags based on the given names then send it
        if(documentsToInsert.length === 0) {
            const createdTags = await Tag.find({ name: [...tags] }).sort({ createdAt: 1 });

            res.status(200).json({ tags: createdTags });
            return;
        }

        const tagList = await Tag.insertMany(documentsToInsert, { ordered: false });

        res.status(201).json({ tags: tagList });
    })
];

export default {
    tags_new,
}