import express from 'express';
import { getChatHistory, getLastMessage } from '../interfaces/http/controllers/message.controller';

const router = express.Router();

router.get('/history/:userA/:userB', getChatHistory);
router.get('/last', getLastMessage);

export default router;