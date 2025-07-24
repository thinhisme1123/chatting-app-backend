"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/friend.route.ts
const express_1 = __importDefault(require("express"));
const friend_controller_1 = require("../interfaces/http/controllers/friend.controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
const router = express_1.default.Router();
router.post('/pending-requests', auth_middleware_1.authMiddleware, friend_controller_1.getPendingRequestsController);
router.post('/request', auth_middleware_1.authMiddleware, friend_controller_1.sendFriendRequestController);
router.post('/respond', auth_middleware_1.authMiddleware, friend_controller_1.respondToFriendRequestController);
router.post('/list', auth_middleware_1.authMiddleware, friend_controller_1.getConfirmedFriendsController);
router.post('/search', auth_middleware_1.authMiddleware, friend_controller_1.searchUsersController);
router.post('/sent', auth_middleware_1.authMiddleware, friend_controller_1.getSentFriendRequestsController);
router.get("/search", auth_middleware_1.authMiddleware, friend_controller_1.searchConfirmedFriendsController);
exports.default = router;
