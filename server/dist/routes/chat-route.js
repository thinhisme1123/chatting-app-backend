"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_controller_1 = require("./../interfaces/http/controllers/room.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/create", room_controller_1.createRoomController);
router.get("/get-room/:userId", room_controller_1.getUserRoomsController);
router.get("/get-group-messages/:roomId", room_controller_1.getGroupMessagesController);
exports.default = router;
