import User from '../../models/userModel.mjs';

const isUsernameExist = async (val) => {
    try {
        const userExist = await User.findOne({ username: val }).collation({ locale: 'en', strength: 2 }).exec();

        if(userExist) return Promise.reject('username already in use');

        return Promise.resolve();
    } catch (error) {
        console.error(error);
    }
};

const isEmailExist = async (val) => {
    try {
        const userExist = await User.findOne({ email: val }).collation({ locale: 'en', strength: 2 }).exec();

        if(userExist) return Promise.reject('email already in use');

        return Promise.resolve();
    } catch (error) {
        console.error(error);
    }
};

const isValidEmail = (email) => {
    // https://regexr.com/82gr2
    return  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
};

const isNotEmpty = (val) => (val.length > 0);

const isPasswordMatch = (val, { req }) => val === req.body.password;

export {
    isUsernameExist,
    isNotEmpty,
    isEmailExist,
    isValidEmail,
    isPasswordMatch,
};