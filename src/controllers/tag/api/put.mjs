import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Tag from '../../../models/tagSchema.mjs';
import formConstants from '../../../constants/formConstants.mjs';
import FormError from '../../../helpers/errors/formError.mjs';
import { isNotEmpty } from '../../../helpers/validators/validators.mjs';

const tags_update = [
    body(formConstants.NAME)
        .trim()
        .custom(isNotEmpty)
        .withMessage('name must not be empty')
        .escape(),

    asyncHandler(async (req, res, _) => {
        const { name } = req.body;
        const { tagId } = req.params;
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

        const tag = await Tag.findByIdAndUpdate(tagId, { name }, { new: true });

        res.status(200).json({ tag });
    }),
];

export default {
    tags_update,
};
