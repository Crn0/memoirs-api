import { Router } from 'express';
import UserController from '../controllers/user/index.mjs';
import attachToken from '../middlewares/attachToken.mjs';
import verifyToken from '../middlewares/verifyToken.mjs';
import isAdmin from '../middlewares/isAdmin.mjs';
import isCurrentUser from '../middlewares/isAdminOrCurrentUser.mjs';

const route = Router();

route.get('/', [attachToken, verifyToken, isAdmin], UserController.GET.users);
route.get('/:userId', [attachToken, verifyToken],UserController.GET.users_detail);

route.post('/', UserController.POST.users_signup);
route.post('/tokens', UserController.POST.users_login);
// TODO: IMPLEMENT LIKE COMMENTS
// route.post('/:userId/:commentId', UserController.POST.users_like_comment);

route.put('/:userId', [attachToken, verifyToken, isCurrentUser], UserController.PUT.users_update);

route.delete('/:userId', [attachToken, verifyToken, isCurrentUser], UserController.DELETE.users_delete);

export default route;