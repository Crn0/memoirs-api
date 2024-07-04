import asyncHandler from 'express-async-handler';
import User from '../../../models/userModel.mjs';

const users_update = asyncHandler((req, res, _) => {

    res.json({
        message: 'PUT: update user information'
    })
});

export default {
    users_update
};