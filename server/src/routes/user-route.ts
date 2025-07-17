import express from 'express';
import { uploadAvatar, uploadGroupAvatar } from '../interfaces/http/controllers/user.controller';
import { uploadAvatar as uploadMulter} from '../middleware/upload';

const router = express.Router();

router.post("/upload-avatar", uploadMulter, uploadAvatar);
router.post("/upload-group-avatar", uploadMulter, uploadGroupAvatar);

export default router;