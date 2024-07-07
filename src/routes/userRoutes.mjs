import { Router } from 'express';
import UserController from '../controllers/user/index.mjs';
import verifyToken from '../middlewares/verifyToken.mjs';
import isAdmin from '../middlewares/isAdmin.mjs';
import isCurrentUser from '../middlewares/isAdminOrCurrentUser.mjs';
import validObjectId from '../middlewares/isObjectId.mjs';


const route = Router();

route.get('/', verifyToken, isAdmin, UserController.GET.users);
route.get('/:userId', verifyToken, validObjectId('userId'), UserController.GET.users_detail);

route.post('/', UserController.POST.users_signup);
route.post('/tokens', UserController.POST.users_login);
// TODO: IMPLEMENT LIKE COMMENTS
// route.post('/:userId/:commentId', UserController.POST.users_like_comment);

route.put('/:userId', verifyToken, [validObjectId('userId'), isCurrentUser], UserController.PUT.users_update);

route.delete('/:userId', verifyToken, [validObjectId('userId'), isCurrentUser], UserController.DELETE.users_delete);

export default route;