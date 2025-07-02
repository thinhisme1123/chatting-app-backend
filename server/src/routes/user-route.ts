import express from 'express';
import { upload } from "../middleware/upload";
import { updateAvatar } from '../interfaces/http/controllers/user.controller';

const router = express.Router();

router.post("/upload-avatar", upload.single("avatar"), updateAvatar);

export default router;