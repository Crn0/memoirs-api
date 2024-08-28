import { Router } from 'express';
import multer from 'multer';
import PostController from '../controllers/post/index.mjs';
import upload from '../configs/multer.mjs';
import verifyToken from '../middlewares/verifyToken.mjs';
import isAdminOrAuthor from '../middlewares/isAdminOrAuthor.mjs';
import validObjectId from '../middlewares/isObjectId.mjs';
import isTheAuthorOfPost from '../middlewares/isPostAuthor.mjs';
import formConstants from '../constants/formConstants.mjs';
import FormError from '../helpers/errors/formError.mjs';
import attachUser from '../middlewares/attachUser.mjs'

const route = Router();
// GET
// get all blog post
route.get('/', attachUser, PostController.GET.posts);
route.get(
    '/author',
    verifyToken,
    PostController.GET.posts_author
);
// GET
// get a single blog post
route.get(
    '/:postId',
    validObjectId('postId'),
    attachUser,
    PostController.GET.posts_detail
);
// POST
// create a new blog post
route.post(
    '/',
    [verifyToken, isAdminOrAuthor],
    (req, res, next) => {
        upload.single(formConstants.COVER)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                next(
                    new FormError(err.message, {
                        type: 'field',
                        field: err.field,
                        message: err.code,
                    })
                );
            } else if (err) {
                next(
                    new FormError(err.message, {
                        type: 'field',
                        field: err.field,
                        message: err.code,
                    })
                );
            }

            next();
        });
    },
    PostController.POST.posts_new
);
// PUT
// update a blog post
route.put(
    '/:postId',
    [validObjectId('postId'), verifyToken, isAdminOrAuthor, isTheAuthorOfPost],
    (req, res, next) => {
        upload.single(formConstants.COVER)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                next(
                    new FormError(err.message, {
                        type: 'field',
                        field: err.field,
                        message: err.code,
                    })
                );
            } else if (err) {
                next(
                    new FormError(err.message, {
                        type: 'field',
                        field: err.field,
                        message: err.code,
                    })
                );
            }

            next();
        });
    },
    PostController.PUT.posts_update
);

route.put(
    '/:postId/status',
    [validObjectId('postId'), verifyToken, isAdminOrAuthor, isTheAuthorOfPost],
    // upload.single(formConstants.COVER),
    PostController.PUT.posts_status
);
// DELETE
// delete a blog post
route.delete(
    '/:postId',
    validObjectId('postId'),
    verifyToken,
    PostController.DELETE.posts_delete
);

export default route;
