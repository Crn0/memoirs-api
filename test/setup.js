import mongoConfig from './mongo.config.js';
import User from '../src/models/userSchema.mjs';
import Post from '../src/models/postSchema.mjs';
import Comment from '../src/models/commentSchema.mjs';

const { init } = mongoConfig;

const createTestAuthor = async () => {
    return User.create({
        firstName: 'krno',
        lastName: 'crno',
        email: 'crno.author@test.com',
        username: 'krno_crno',
        membership: 'Author',
        password: 'test1234',
    });
};

const createTestReader = async () =>
    User.create({
        firstName: 'Test',
        lastName: 'Reader',
        email: 'reader01@test.com',
        username: 'test_reader01',
        membership: 'Reaader',
        password: 'test1234',
    });

const createPosts = async (id) => {
    const publicPost = Post.create({
        title: 'Test Post 1',
        body: 'This is a test post',
        author: id,
        isPrivate: false,
    });

    const privatePost = Post.create({
        title: 'Test Post 2',
        body: 'This is a test post',
        author: id,
        isPrivate: true,
    });

    return Promise.all([publicPost, privatePost]);
};

const createComments = async (authorIds, postId) => {
    const [comment1, comment2] = await Promise.all(
        authorIds.map(async (authorId) =>
            Comment.create({
                body: 'Test Comment 1',
                author: authorId,
                post: postId,
            })
        )
    );

    const [reply1, reply2] = await Promise.all(
        authorIds.map(async (authorId) =>
            Comment.create({
                body: 'Test reply 1',
                author: authorId,
                post: postId,
                isReply: true,
            })
        )
    );

    return Promise.all([
        Comment.findOneAndUpdate(
            { _id: comment1.id, isDeleted: false },
            { $push: { replies: reply1.id } },
            { new: true }
        ).populate('replies'),
        Comment.findOneAndUpdate(
            { _id: comment2.id, isDeleted: false },
            { $push: { replies: reply2.id } },
            { new: true }
        ).populate('replies'),
    ]);
};

export default async function setup() {
    await init();

    const author = await createTestAuthor();
    const reader = await createTestReader();
    const [publicPost] = await createPosts(author.id);

    await createComments([author.id, reader.id], publicPost.id);
}
