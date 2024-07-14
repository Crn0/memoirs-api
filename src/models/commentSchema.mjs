import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const commentSchema = new Schema({
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    body: { type: String, required: true },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    likes: {
        users: [ { type: Types.ObjectId } ],
        count: { type: Number, default: 0 },
    },
    post: {
        type: Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    isReply: { type: Boolean, required: true, default: false},
    replies: [
        {
            type: Types.ObjectId,
            ref: 'Comment'
        }
    ],
}, { timestamps: { createdAt: 'created_at' } } );

commentSchema.virtual('id').get(function() {

    return `${this._id}`
})

export default mongoose.model('Comment', commentSchema);
