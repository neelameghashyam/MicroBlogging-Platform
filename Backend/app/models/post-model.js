import { model, Schema } from "mongoose";

const commentsSchema = new Schema({
    body: String,
    user: { type: Schema.Types.ObjectId}
}, { timestamps: true });

const postSchema = new Schema({
    title: String,
    user: { type: Schema.Types.ObjectId},
    body: String,
    keywords: String,
    file: String, // Store the file path as a string
    comments: [commentsSchema],
    likes: [{ type: Schema.Types.ObjectId}]
}, { timestamps: true });

const Post = model("Post", postSchema);

export default Post;
