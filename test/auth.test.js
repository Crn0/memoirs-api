import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.mjs';

vi.mock(import('bcryptjs'), async (importOriginal) => {
    const res = await importOriginal();
    const mod = { ...res }.default;

    return {
        default: {
            ...mod,
            compare: (a, b) => a === b,
        },
    };
});

vi.mock(import('jsonwebtoken'), async (importOriginal) => {
    const res = await importOriginal();
    const mod = { ...res }.default;

    return {
        default: {
            ...mod,
            sign: (payload, secret, options, cb) => {
                const token = 'jwt token';

                if (typeof cb === 'function') {
                    return cb(null, token);
                }

                return token;
            },
        },
    };
});

describe('Authentication route', () => {
    describe('sign-up', () => {
        it('sends the client a user object and token on successful sign up', async () => {
            const res = await request(app)
                .post('/users')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    username: 'jDoe',
                    email: 'john.test@test.com',
                    password: 'test1234',
                    confirm_password: 'test1234',
                })
                .set('Accept', 'application/json');

            expect(res.header['content-type'], /json/);
            expect(res.statusCode).toEqual(201);
            expect(res.body.user).toBeInstanceOf(Object);
            expect(res.body.token).toMatch('jwt token');
        });

        it('sends the client a error messages when a required fields are missing', async () => {
            const res = await await request(app)
                .post('/users')
                .send({
                    firstName: '',
                    lastName: '',
                    username: 'jDoe',
                    email: 'john.test@test.com',
                    password: 'test1234',
                    confirm_password: 'test1234',
                })
                .set('Accept', 'application/json');

            expect(res.header['content-type'], /json/);
            expect(res.statusCode).toEqual(422);
            expect(res.body.error.name).toMatch('FormError');
            expect(res.body.error.message).toBeInstanceOf(Array);
            expect(res.body.error.message[0]).toMatchObject({
                type: 'field',
                field: 'firstName',
                message: 'First name must not be empty',
            });
            expect(res.body.error.message[1]).toMatchObject({
                type: 'field',
                field: 'lastName',
                message: 'Last name must not be empty',
            });
        });
    });

    describe('login', () => {
        it('sends the client a user object and token on successful login', async () => {
            const res = await request(app)
                .post('/users/tokens')
                .send({ email: 'crno.author@test.com', password: 'test1234' })
                .set('Accept', 'application/json');

            expect(res.header['content-type'], /json/);
            expect(res.statusCode).toEqual(200);
            expect(res.body.user).toBeInstanceOf(Object);
            expect(res.body.token).toMatch('jwt token');
        });

        it('sends the client a error messages on wrong credentials', async () => {
            const resEmail = await request(app)
                .post('/users/tokens')
                .send({ email: 'wrongemail@test.com', password: 'test1234' })
                .set('Accept', 'application/json');

            const resPassword = await request(app)
                .post('/users/tokens')
                .send({ email: 'crno.author@test.com', password: 'foo1234' })
                .set('Accept', 'application/json');

            const _body = {
                code: 401,
                error: {
                    name: 'Authenticate Error',
                    message: 'Invalid email or password',
                },
                message: 'Authentication failed',
            };

            expect(resEmail.header['content-type'], /json/);
            expect(resEmail.statusCode).toEqual(401);
            expect(resEmail.body.code).toEqual(_body.code);
            expect(resEmail.body.error).toMatchObject(_body.error);
            expect(resEmail.body.message).toMatch(_body.message);

            expect(resPassword.header['content-type'], /json/);
            expect(resPassword.statusCode).toEqual(401);
            expect(resPassword.body.code).toEqual(_body.code);
            expect(resPassword.body.error).toMatchObject(_body.error);
            expect(resPassword.body.message).toMatch(_body.message);
        });
    });
});
