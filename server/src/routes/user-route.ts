import express from 'express';
import { uploadAvatar } from '../interfaces/http/controllers/user.controller';
import { uploadAvatar as uploadMulter } from '../middleware/upload';

const router = express.Router();

router.post("/upload-avatar", uploadMulter, uploadAvatar);

export default router;