import { Router } from 'express';
import PostController from '../controllers/post/index.mjs';

const route = Router();
// GET 
// get all blog post
route.get('/', PostController.GET.posts);
// GET 
// get a single blog post
route.get('/:postId', PostController.GET.posts_detail);
// POST
// create a new blog post
route.post('/', PostController.POST.posts_new);
// PUT
// update a blog post
route.put('/:postId', PostController.PUT.posts_update);
// DELETE
// delete a blog post
route.delete('/:postId', PostController.DELETE.posts_delete);

export default route;
