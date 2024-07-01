import mongoose from "mongoose";

const { Schema } = mongoose;

const tagSchema = new Schema({ name: { type: String, required: true } }, { timestamps: true });

export default mongoose.model('Tag', tagSchema);