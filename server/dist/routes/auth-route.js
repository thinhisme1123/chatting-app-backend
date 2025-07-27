"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../interfaces/http/controllers/auth.controller");
const router = express_1.default.Router();
router.post('/login', auth_controller_1.loginController);
router.post('/register', auth_controller_1.registerController);
router.post('/logout', auth_controller_1.logoutController);
router.get('/users', auth_controller_1.getAllUsersExceptMe);
exports.default = router;
