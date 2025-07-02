// src/middleware/upload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => {
    return {
      folder: "chat_app/avatars",
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 300, height: 300, crop: "limit" }],
    } as any; // 👈 This is the trick
  },
});

export const upload = multer({ storage });

