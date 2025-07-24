"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const user_model_1 = require("../../infrastructure/db/models/user-model");
const http_error_1 = require("../../interfaces/http/controllers/http-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user)
        throw new http_error_1.HttpError(401, "Email không tồn tại");
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new http_error_1.HttpError(401, "Mật khẩu không đúng");
    return {
        userId: user._id.toString(),
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar
        },
    };
});
exports.loginUser = loginUser;
