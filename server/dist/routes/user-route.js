"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../interfaces/http/controllers/user.controller");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post("/upload-avatar", upload_1.uploadAvatar, user_controller_1.uploadAvatar);
router.post("/upload-group-avatar", upload_1.uploadAvatar, user_controller_1.uploadGroupAvatar);
exports.default = router;
