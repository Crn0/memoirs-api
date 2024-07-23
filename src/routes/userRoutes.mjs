import { Router } from 'express';
import UserController from '../controllers/user/index.mjs';
import verifyToken from '../middlewares/verifyToken.mjs';
import isAdmin from '../middlewares/isAdmin.mjs';
import validObjectId from '../middlewares/isObjectId.mjs';

const route = Router();

route.get('/', verifyToken, isAdmin, UserController.GET.users);
route.get('/token/me', verifyToken, UserController.GET.users_token_me);
route.get(
    '/:userId',
    verifyToken,
    validObjectId('userId'),
    UserController.GET.users_detail
);

route.post('/', UserController.POST.users_signup);
route.post('/tokens', UserController.POST.users_login);

route.put(
    '/',
    validObjectId('userId'),
    verifyToken,
    UserController.PUT.users_update
);
route.put('/posts', verifyToken, UserController.PUT.users_bookmark);

route.delete(
    '/',
    validObjectId('userId'),
    verifyToken,
    UserController.DELETE.users_delete
);
route.delete(
    '/posts/:postId',
    validObjectId('postId'),
    verifyToken,
    UserController.DELETE.users_bookmark
);

export default route;
