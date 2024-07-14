import { Router } from 'express';
import CommentController from '../controllers/comment/index.mjs';
import verifyToken from '../middlewares/verifyToken.mjs';
import validObjectId from '../middlewares/isObjectId.mjs';

const route = Router();

// GET
route.get('/:postId/comments', validObjectId('postId'), CommentController.GET.comments);
// get a single comment
route.get('/:postId/comments/:commentId', CommentController.GET.comments_target);
// POST
// create a new comment
route.post('/:postId/comments', [validObjectId('postId'), verifyToken], CommentController.POST.comments_new);
// reply to a comment
route.post('/:postId/comments/:commentId', [validObjectId('postId'), validObjectId('commentId'), verifyToken], CommentController.POST.comments_reply);
// PUT
// edit a comment
route.put('/:postId/comments/:commentId/', [validObjectId('postId'), validObjectId('commentId')], verifyToken, CommentController.PUT.comments_update);
route.put('/:postId/comments/:commentId/likes',[validObjectId('postId'), validObjectId('commentId')], verifyToken, CommentController.PUT.comments_like);

// DELETE
// delete all comments
route.delete('/:postId/comments/', CommentController.DELETE.comments_delete_all);
// delete a single comment
route.delete('/:postId/comments/:commentId', [validObjectId('postId'), validObjectId('commentId')], verifyToken, CommentController.DELETE.comments_delete);
route.delete('/:postId/comments/:commentId/likes/', [validObjectId('postId'), validObjectId('commentId')], verifyToken, CommentController.DELETE.comments_unlike);


export default route;



