import express from 'express';
import { deleteMessageController, getChatHistoryController, getGroupLastMessageController, getLastMessageController } from '../interfaces/http/controllers/message.controller';

const router = express.Router();

router.get('/history/:userA/:userB', getChatHistoryController);
router.get('/last', getLastMessageController);
router.get('/room-last-message/:roomId', getGroupLastMessageController)
router.delete('/delete/:messageId', deleteMessageController)

export default router;