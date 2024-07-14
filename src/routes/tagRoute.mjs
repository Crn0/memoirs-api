import { Router } from 'express';
import TagController from '../controllers/tag/index.mjs';
import isObjectId from '../middlewares/isObjectId.mjs'
import verifyToken from '../middlewares/verifyToken.mjs';
import isAdminOrAuthor from '../middlewares/isAdminOrAuthor.mjs'
import isAdmin from '../middlewares/isAdmin.mjs';

const router = Router();

router.get('/', TagController.GET.tags);
router.get('/:tagId', isObjectId('tagId'), TagController.GET.tag_detail)

router.post('/', [verifyToken, isAdminOrAuthor], TagController.POST.tags_new);

router.put('/:tagId', isObjectId('tagId'), [verifyToken, isAdminOrAuthor], TagController.PUT.tags_update);

router.delete('/:tagId', isObjectId('tagId'), [verifyToken, isAdmin], TagController.DELETE.tags_delete);

export default router;