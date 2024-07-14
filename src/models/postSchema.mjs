import mongoose from "mongoose";
import Comment from './commentSchema.mjs'
import User from "./userSchema.mjs";

const { Schema, Types } = mongoose;

const postSchema = new Schema({
    author: { type: Types.ObjectId, ref: 'User', required: true },
    cover: {
        url: { type: String, default: '' },
        cloudinary_id: { type: String, default: '' },
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isPrivate: {
        type: Boolean,
        required: true,
        default: false,
    },
    tags: [{
        type: Types.ObjectId,
        ref: 'Tag',
    }],
},
{ timestamps: true }
);

postSchema.virtual('id').get(function() {

    return `${this._id}`
});
postSchema.pre('findOneAndDelete', async function() {
    const id = this.getQuery()._id;

    await Comment.deleteMany({ post: id });    
    await User.updateMany({ $in: { bookmarks: id } }, { $pull: { bookmarks: id }});
})

export default mongoose.model('Post', postSchema);