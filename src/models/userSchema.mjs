import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        membership: {
            type: String,
            required: true,
            enums: ['Author', 'Reader', 'Admin'],
            default: 'Reader',
        },
        bookmarks: [
            {
                type: Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    { timestamps: true }
);

userSchema.virtual('id').get(function () {
    return `${this._id}`;
});

export default mongoose.model('User', userSchema);
