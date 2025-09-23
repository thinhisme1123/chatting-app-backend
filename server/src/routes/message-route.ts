import express from 'express';
import { deleteMessageController, getChatHistoryController, getGroupLastMessageController, getLastMessageController } from '../interfaces/http/controllers/message.controller';
import { addOrUpdateReaction, getReactionsByMessage, removeReaction } from '../interfaces/http/controllers/reaction.controller';
import { generateSmartReply } from '../interfaces/http/controllers/smartReply.controller';

const router = express.Router();

router.get('/history/:userA/:userB', getChatHistoryController);
router.get('/last', getLastMessageController);
router.get('/room-last-message/:roomId', getGroupLastMessageController)
router.delete('/delete/:messageId', deleteMessageController)
router.post("/:messageId/reactions", addOrUpdateReaction);
router.delete("/:messageId/reactions", removeReaction);
router.get("/:messageId/reactions", getReactionsByMessage);
router.post("/smart-reply", generateSmartReply);

export default router;