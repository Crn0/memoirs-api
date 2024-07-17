import mongoose from 'mongoose';
import Post from './postSchema.mjs';

const { Schema } = mongoose;

const tagSchema = new Schema(
    { name: { type: String, required: true, unique: true } },
    { timestamps: true }
);

tagSchema.virtual('id').get(function () {
    return `${this._id}`;
});

tagSchema.pre('findOneAndDelete', async function () {
    const id = this.getQuery();

    await Post.updateMany({ _id: id }, { $pull: { tags: id } });
});

export default mongoose.model('Tag', tagSchema);
