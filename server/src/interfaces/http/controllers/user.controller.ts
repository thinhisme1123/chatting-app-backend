// src/interfaces/http/controllers/user.controller.ts
import type { Request, Response } from "express";
import cloudinary from "../../../config/cloudinary";
import { UserModel } from "../../../infrastructure/db/models/user-model";
import dotenv from "dotenv";
dotenv.config();

export const uploadAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "chat-app/avatars",
        transformation: [
          { width: 256, height: 256, crop: "thumb", gravity: "face" },
        ],
      },
      async (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          res.status(500).json({ message: "Upload failed", error });
          return;
        }

        // Save to DB
        await UserModel.findByIdAndUpdate(userId, {
          avatar: result.secure_url,
        });

        res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    // Pipe multer buffer into Cloudinary upload stream
    result.end(file.buffer);
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

export const uploadImageMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "chat-app/messages",
        // Simpler transformation settings
        transformation: [
          {
            width: 1200,
            height: 800,
            crop: "limit",
            quality: "auto"
          },
        ],
        eager: [
          {
            width: 300,
            height: 200,
            crop: "fit",
            quality: "auto"
          },
        ],
        eager_async: false,
      },
      async (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          res.status(500).json({ message: "Upload failed", error });
          return;
        }

        res.status(200).json({ 
          imageUrl: result.secure_url,
          thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
          width: result.width,
          height: result.height
        });
      }
    );

    result.end(file.buffer);
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};