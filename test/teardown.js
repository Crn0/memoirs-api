import mongoConfig from './mongo.config.js';
import User from '../src/models/userSchema.mjs';
import Post from '../src/models/postSchema.mjs';
import Comment from '../src/models/commentSchema.mjs';

const { close } = mongoConfig;

const getUsers = async () => User.find({});

const deleleCommentsByUserIds = async (ids) =>
    Comment.deleteMany({ author: { $in: ids } });

const deletePostsByUserIds = async (ids) =>
    Post.deleteMany({ author: { $in: ids } });

const deleteUsers = async (ids) =>
    User.deleteMany({
        _id: { $in: ids },
    });

export default async function teardown() {
    const users = await getUsers();
    const userIds = users.map((user) => user._id);

    await deleleCommentsByUserIds(userIds);
    await deletePostsByUserIds(userIds);
    await deleteUsers(userIds);

    close();
}
