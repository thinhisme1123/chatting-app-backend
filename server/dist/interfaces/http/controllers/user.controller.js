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
exports.uploadGroupAvatar = exports.uploadAvatar = void 0;
// src/controllers/user.controller.ts
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_1 = require("@aws-sdk/client-s3");
const user_model_1 = require("../../../infrastructure/db/models/user-model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const uploadAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const userId = req.body.userId;
        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const fileKey = `avatars/${Date.now()}_${file.originalname}`;
        const upload = new lib_storage_1.Upload({
            client: s3,
            params: {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            },
        });
        yield upload.done();
        const imageUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`;
        yield user_model_1.UserModel.findByIdAndUpdate(userId, { avatar: imageUrl });
        res.status(200).json({ imageUrl }); // ✅ No `return`
    }
    catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({ message: "Upload failed", error });
    }
});
exports.uploadAvatar = uploadAvatar;
const uploadGroupAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const userId = req.body.userId;
        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const fileKey = `avatars/${Date.now()}_${file.originalname}`;
        const upload = new lib_storage_1.Upload({
            client: s3,
            params: {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            },
        });
        yield upload.done();
        const imageUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`;
        yield user_model_1.UserModel.findByIdAndUpdate(userId, { avatar: imageUrl });
        res.status(200).json({ imageUrl }); // ✅ No `return`
    }
    catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({ message: "Upload failed", error });
    }
});
exports.uploadGroupAvatar = uploadGroupAvatar;
