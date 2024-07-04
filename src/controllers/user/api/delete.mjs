import asyncHandler from 'express-async-handler';
import User from '../../../models/userModel.mjs';


const users_delete = asyncHandler( async (req, res, _) => {

    res.json({
        message: 'DELETE: delete user'
    })
});

export default {
    users_delete,
};
    