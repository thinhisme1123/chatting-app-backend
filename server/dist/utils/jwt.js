"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EXPIRES_IN = "7d";
function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: EXPIRES_IN,
    });
}
// khác nhau về JWT_SECRECT lúc mới login vào có thể dẫn đến lỗi không thể đi qua lớp middleware
