import { Express } from "express";
import authRoutes from "./auth-route";
import messageRoutes from "./message-route";
import userRoutes from "./user-route";
import friendRoutes from "./friend-route"

export const mainRoutes = (app: Express) => {
  app.use("/auth", authRoutes);
  app.use("/messages", messageRoutes);
  app.use("/user", userRoutes);
  app.use("/friend", friendRoutes);
};
