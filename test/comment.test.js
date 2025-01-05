import { describe, it, expect, vi } from 'vitest';
import passport from 'passport';
import request from 'supertest';
import app from '../src/app.mjs';
import Post from '../src/models/postSchema.mjs';
import User from '../src/models/userSchema.mjs';

passport.authenticate = vi.fn((strategy, options, cb) => async (req) => {
    req.login = (val) => (req.user = val);

    if (typeof cb === 'function') {
        const user = await getUser('reader01@test.com');
        return cb(null, user, null);
    }
});

const getPublicPosts = async () => Post.find({});
const getUser = async (email) => {
    return User.findOne({ email });
};

describe('Comment Route', () => {
    it('it sends a json when the client post a comment', async () => {
        const posts = await getPublicPosts();
        const publicPost = posts.filter((post) => !post.isPrivate);
        const postId = publicPost[0]._id.toString();

        const res = await request(app)
            .post(`/posts/${postId}/comments`)
            .send({ body: 'Test comment' })
            .set('Accept', 'application/json');

        expect(res.header['content-type'], /json/);
        expect(res.statusCode).toEqual(201);
        expect(res.body.comment).toBeInstanceOf(Object);
    });

    it('it sends a json when the client reply to a comment', async () => {
        const posts = await getPublicPosts();
        const publicPost = posts.filter((post) => !post.isPrivate);
        const postId = publicPost[0]._id.toString();
        const commentId = publicPost[0].comments[0].toString();

        const res = await request(app)
            .post(`/posts/${postId}/comments/${commentId}`)
            .send({ body: 'Test reply' })
            .set('Accept', 'application/json');

        expect(res.header['content-type'], /json/);
        expect(res.statusCode).toEqual(201);
        expect(res.body.comment).toBeInstanceOf(Object);
    });

    it('sends a error message if the comment body is empty', async () => {
        const posts = await getPublicPosts();
        const publicPost = posts.filter((post) => !post.isPrivate);
        const postId = publicPost[0]._id.toString();

        const res = await request(app)
            .post(`/posts/${postId}/comments`)
            .send({ body: '' })
            .set('Accept', 'application/json');

        expect(res.header['content-type'], /json/);
        expect(res.statusCode).toEqual(422);
        expect(res.body.error.name).toMatch(/FormError/);
        expect(res.body.message).toMatch(
            /Validation failed. Invalid form inputs/
        );
    });
});
