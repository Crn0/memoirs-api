import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import logger from 'morgan';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {
    DB_URI,
    NODE_ENV,
} from './constants/env.mjs';
import * as Routes from './routes/indexRoute.mjs';
import LocalStrategy from './configs/localStrategy.mjs';
import errorHandler from './helpers/errors/errorHandler.mjs';

const app = express();
const __dirname =
    import.meta.dirname || dirname(fileURLToPath(import.meta.url));
// Define the database URL to connect to.
const mongoDb = DB_URI;
// Wait for database to connect, logging an error if there is a problem
const main = async () => await mongoose.connect(mongoDb);

main().catch(console.error);

// Passport local strategy
passport.use(LocalStrategy);

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieParser());
app.use(helmet());
app.use(compression()); // Compress all routes
app.use(express.static(join(__dirname, '..', 'public')));

// ROUTES
app.use('/users', Routes.UserRoute);
app.use('/posts', Routes.PostRoute);
app.use('/posts', Routes.CommentRoute);

// error handler
app.use((err, req, res, _) => {



    errorHandler.handleError(err, res)
});

export default app;
