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

const app = express();
const __dirname =
    import.meta.dirname || dirname(fileURLToPath(import.meta.url));
// Define the database URL to connect to.
const mongoDb = process.env.MONGO_DB;
// Wait for database to connect, logging an error if there is a problem
const main = async () => await mongoose.connect(mongoDb);

main().catch(console.error);

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



// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, _) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
