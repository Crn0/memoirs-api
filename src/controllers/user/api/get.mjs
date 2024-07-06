import asyncHandler from 'express-async-handler';
import User from '../../../models/userModel.mjs'
import APIError from '../../../helpers/errors/apiError.mjs';
import httpStatusCode from '../../../constants/httpStatusCode.mjs';


const users =  asyncHandler(async (req, res, _) => {
    const users = await User.find({}).sort({ firstName: 1, lastName: 1 }).exec();

    res.status(200).json(    
        users,
    )
        
})

const users_detail = asyncHandler(async (req, res, _) => {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if(!user) {
        throw new APIError('NOT FOUND', 'User does not exist', 'USER MODEL', httpStatusCode.NOT_FOUND)
    }

    res.json({
        user,
    })
});

export default {
    users,
    users_detail
};