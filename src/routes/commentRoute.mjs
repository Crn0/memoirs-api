import { Router } from 'express';
import CommentController from '../controllers/comment/index.mjs';

const route = Router();

// GET
route.get('/:postId/comments', CommentController.GET.comments);
// get a single comment
route.get('/:postId/comments/:commentId', CommentController.GET.comments_target);
// POST
// create a new comment
route.post('/:postId/comments', CommentController.POST.comments_new);
// reply to a comment
route.post('/:postId/comments/:commentId', CommentController.POST.comments_reply);
// PUT
// edit a comment
route.put('/:postId/comments/:commentId', CommentController.PUT.comments_update);
// DELETE
// delete all comments
route.delete('/:postId/comments/', CommentController.DELETE.comments_delete_all);
// delete a single comment
route.delete('/:postId/comments/:commentId', CommentController.DELETE.comments_delete);

export default route;



