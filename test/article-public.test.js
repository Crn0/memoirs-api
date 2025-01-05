import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.mjs';
import Post from '../src/models/postSchema.mjs';

const getPublicPosts = async () => Post.find({});

describe('Article Public Route', () => {
    it('sends an array of articles', async () => {
        const res = await request(app)
            .get('/posts')
            .set('Accept', 'application/json');

        expect(res.header['content-type'], /json/);
        expect(res.body.posts).toBeInstanceOf(Array);
        expect(res.statusCode).toEqual(200);
    });

    it('sends the article with the given parameter id', async () => {
        const posts = await getPublicPosts();
        const publicPost = posts.filter((post) => !post.isPrivate);
        const postId = publicPost[0]._id.toString();

        const res = await request(app)
            .get(`/posts/${postId}`)
            .set('Accept', 'application/json');

        expect(res.header['content-type'], /json/);
        expect(res.statusCode).toEqual(200);
        expect(res.body.post._id).toMatch(postId);
    });
});
