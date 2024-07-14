import asyncHandler from 'express-async-handler';
import Tag from "../../../models/tagSchema.mjs";
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';

const tags = asyncHandler(async (req, res, _) => {
    const { limit, sortBy } = req.query;
    const sortKey = sortBy?.split(/[x^+-]/)?.join('')?.trim() || 'name';
    const sortOrder = sortBy?.includes('-') ? -1 : 1;

    const tagList = await Tag.find({}).limit( limit || 10 ).sort({ [sortKey]: sortOrder });
    const total = await Tag.countDocuments().exec();
    
    res.status(200).json({ 
        total,
        tags: tagList,
        limit: Number(limit) || 10,
     })
});

const tag_detail = asyncHandler(async (req, res, _) => {
    const { tagId } = req.params;
    const tag = await Tag.findById(tagId);

    if(tag === null) {
        throw new APIError('tag does not exist', 'NOT FOUND', 'RESOURCE ERROR', httpStatusCode.NOT_FOUND);
    }
    
    res.status(200).json({ tag });
});

export default {
    tags,
    tag_detail,
};