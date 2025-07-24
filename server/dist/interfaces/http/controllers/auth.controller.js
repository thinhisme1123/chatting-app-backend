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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersExceptMe = exports.logoutController = exports.registerController = exports.loginController = void 0;
const login_use_case_interface_1 = require("../../../application/auth/login-use-case.interface");
const register_use_case_interface_1 = require("../../../application/auth/register-use-case.interface");
const jwt_1 = require("../../../utils/jwt");
const user_model_1 = require("../../../infrastructure/db/models/user-model");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const result = yield (0, login_use_case_interface_1.loginUser)(email, password);
        const token = (0, jwt_1.generateToken)(result.userId);
        res.json({
            user: result.user,
            token,
        });
    }
    catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(statusCode).json({ message });
    }
});
exports.loginController = loginController;
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    try {
        const result = yield (0, register_use_case_interface_1.registerUser)(email, username, password);
        res.status(201).json(Object.assign({ message: "Đăng ký thành công" }, result));
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.registerController = registerController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body; // hoặc lấy từ JWT decode middleware nếu có
    try {
        res.status(200).json({ message: "Đăng xuất thành công" });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Lỗi đăng xuất" });
    }
});
exports.logoutController = logoutController;
const getAllUsersExceptMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserId = req.query.currentUserId;
        if (!currentUserId) {
            res.status(400).json({ error: "Missing user ID" });
            return;
        }
        const users = yield user_model_1.UserModel.find({ _id: { $ne: currentUserId } }).select("-password");
        const transformedUsers = users.map((user) => ({
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            isOnline: true,
        }));
        res.status(200).json(transformedUsers);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
exports.getAllUsersExceptMe = getAllUsersExceptMe;
