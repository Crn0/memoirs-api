import User from '../models/userModel.mjs';

const isUsernameExist = async (val) => {
    try {
        const userExist = await User.findOne({ username: val }).collation({ locale: 'en', strength: 2 });

        if(userExist) return Promise.reject('Username already in use');

        return Promise.resolve();
    } catch (error) {
        console.error(error);
    }
};

export {
    isUsernameExist,
};