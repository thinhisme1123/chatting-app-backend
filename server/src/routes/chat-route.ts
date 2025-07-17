import { createRoomController } from './../interfaces/http/controllers/room.controller';
import express from "express";

const router = express.Router();

router.post("/room", createRoomController);

export default router;
