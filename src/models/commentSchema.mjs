import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const commentSchema = new Schema({
    authorName: { type: String, required: true },
    body: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    post: {
        type: Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    replies: [
        {
            type: Types.ObjectId,
            ref: 'Comment'
        }
    ],
}, { timestamps: { createdAt: 'created_at' } } );

export default mongoose.model('Comment', commentSchema);
