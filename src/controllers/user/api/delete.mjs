import asyncHandler from 'express-async-handler';
import User from '../../../models/userModel.mjs';


const users_delete = asyncHandler(async (req, res, _) => {
    const { userId } = req.params;


    await User.findByIdAndDelete(userId);

    res.status(200).json({
        message: 'User deleted'
    });
});

export default {
    users_delete,
};
    