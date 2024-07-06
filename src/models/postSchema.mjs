import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const postSchema = new Schema({
    author: { type: Types.ObjectId, ref: 'User', required: true },
    cover: { type: String },
    title: { type: String, required: true },
    body: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Private', 'Public'],
        default: 'Public'
    },
    tags: [{
        type: Types.ObjectId,
        ref: 'Tag',
    }],
    isDeleted: { type: Boolean, required: true, default: false }
},
{ timestamps: true }
);

export default mongoose.model('Post', postSchema);