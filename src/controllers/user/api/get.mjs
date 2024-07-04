import asyncHandler from 'express-async-handler';
import User from '../../../models/userModel.mjs';

const users = asyncHandler(async (req, res, _) => {

    res.json({
        message: 'GET: user list'
    })
});


const users_detail = asyncHandler(async (req, res, _) => {

    res.json({
        message: `GET: user detail ${req.params.userId}`
    })
});

export default {
    users,
    users_detail
};