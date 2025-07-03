// src/controllers/user.controller.ts
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import type { Request, Response } from "express";
import { UserModel } from "../../../infrastructure/db/models/user-model";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const userId = req.body.userId;
    console.log("File:", file);
    console.log("User ID:", userId);
    

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const fileKey = `avatars/${Date.now()}_${file.originalname}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    const imageUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`;
    console.log(imageUrl);
    
    await UserModel.findByIdAndUpdate(userId, { avatar: imageUrl });

    res.status(200).json({ imageUrl }); // ✅ No `return`
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

