import { createRoomController, getGroupMessagesController, getUserRoomsController } from './../interfaces/http/controllers/room.controller';
import express from "express";

const router = express.Router();

router.post("/create", createRoomController);
router.get("/get-room/:userId", getUserRoomsController);
router.get("/get-group-messages/:roomId", getGroupMessagesController);

export default router;
