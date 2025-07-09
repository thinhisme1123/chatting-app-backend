// routes/friend.route.ts
import express from 'express';
import {
  sendFriendRequestController,
  respondToFriendRequestController,
  getConfirmedFriendsController,
  searchUsersController,
  getSentFriendRequestsController,
} from '../interfaces/http/controllers/friend.controller';
import { authMiddleware } from '../middleware/auth-middleware';

const router = express.Router();

router.post('/request', authMiddleware, sendFriendRequestController);
router.post('/respond', authMiddleware, respondToFriendRequestController);
router.get('/list', authMiddleware, getConfirmedFriendsController);
router.post('/search', authMiddleware, searchUsersController);
router.post('/sent', authMiddleware, getSentFriendRequestsController);

export default router;
