import { Router } from 'express';
import UserController from '../controllers/user/index.mjs';

const route = Router();

route.get('/', UserController.GET.users);
route.get('/:userId', UserController.GET.users_detail);

route.post('/', UserController.POST.users_signup);
route.post('/tokens', UserController.POST.users_login);

route.put('/:userId', UserController.PUT.users_update);

route.delete('/:userId', UserController.DELETE.users_delete);

export default route;