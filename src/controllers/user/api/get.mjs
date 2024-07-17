import asyncHandler from 'express-async-handler';
import User from '../../../models/userSchema.mjs';
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';

const users = asyncHandler(async (req, res, _) => {
    const users = await User.find(
        {},
        'firstName lastName email username membership bookmarks likeComments createdAt updatedAt'
    )
        .sort({ firstName: 1, lastName: 1 })
        .exec();

    res.status(200).json({ users });
});

const users_detail = asyncHandler(async (req, res, _) => {
    const { userId } = req.params;
    const user = await User.findById(
        userId,
        'firstName lastName email username membership bookmarks createdAt updatedAt'
    ).populate(['bookmarks']);

    if (!user) {
        // Change the user model error name
        throw new APIError(
            'User does not exist',
            'NOT FOUND',
            'RESOURCE ERROR',
            httpStatusCode.NOT_FOUND
        );
    }

    res.status(200).json({
        user,
    });
});

export default {
    users,
    users_detail,
};
