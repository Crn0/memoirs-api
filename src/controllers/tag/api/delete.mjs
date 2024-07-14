import asyncHandler from 'express-async-handler';
import Tag from "../../../models/tagSchema.mjs";

const tags_delete = asyncHandler(async (req, res, _) => {
    const { tagId } = req.params;

    await Tag.findByIdAndDelete(tagId);

    res.status(204).json({});
});


export default {
    tags_delete,
};