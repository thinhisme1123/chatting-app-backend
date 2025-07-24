"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../interfaces/http/controllers/message.controller");
const router = express_1.default.Router();
router.get('/history/:userA/:userB', message_controller_1.getChatHistory);
router.get('/last', message_controller_1.getLastMessage);
exports.default = router;
