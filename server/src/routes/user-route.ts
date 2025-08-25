import express from 'express';
import { uploadAvatar, uploadImageMessage } from '../interfaces/http/controllers/user.controller';
import { uploadAvatar as uploadMulter } from '../middleware/upload';

const router = express.Router();

router.post("/upload-avatar", uploadMulter, uploadAvatar);
router.post("/upload-image-message", uploadMulter, uploadImageMessage);

export default router;