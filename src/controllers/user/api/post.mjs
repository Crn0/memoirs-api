import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../../../models/userModel.mjs';
import { isUsernameExist } from '../../../helpers/signupValidators.mjs';


const users_signup = [
    body('firstName')
    .trim()
    .custom((value) => (value.length > 0))
    .withMessage('firstName must not be empty')
    .escape(),
    body('lastName')
    .trim()
    .custom((value) => (value.length > 0))
    .withMessage('lastName must not be empty')
    .escape(),
    body('username')
    .trim()
    .custom((value) => (value.length > 0))
    .withMessage('username must not be empty')
    .custom(isUsernameExist)
    .escape(),
    asyncHandler( async (req, res, _) => {
        const errors = validationResult(req);
        const { firstName, lastName, username, } = req.body;
        // await User.create({
        //     firstName: 'John',
        //     lastName: 'Doe',
        //     email: 'john@gmail.com',
        //     username: 'jDoe',  
        // });
        if(!errors.isEmpty()) {
            console.log(errors.array())
            res.status(200).json({
                errors: errors.array()
            });

            return;
        }
    
        res.json({
            message: 'POST: user signup'
        })
    })
];

// fetch("http://localhost:3000/users/signup", {
//     method: "POST",
//     // ...
//   }).then(res => res.json()).then(console.log)

const users_login = asyncHandler( async (req, res, _) => {

    // 66850fc244fee940d878e8ec
    res.json({
        message: 'POST: user login'
    })
});

export default {
    users_signup,
    users_login,
};
