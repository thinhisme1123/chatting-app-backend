// 📁 server/src/server.ts
import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { mainRoutes } from "./routes";
import { MessageRepository } from "./interfaces/repositories/message.repository";
import { MessageUseCases } from "./application/message/message-use-case.query";
import cookieParser from "cookie-parser";
import { groupMessageSocketHandler } from "./interfaces/http/controllers/message.controller";

const messageUseCases = new MessageUseCases(new MessageRepository());

// Load env vars
dotenv.config();

// Express setup
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mainRoutes(app);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// In-memory map to store userId <-> socketId
const onlineUsers = new Map<string, string>();

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("register-user", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ Registered user: ${userId} -> socket ${socket.id}`);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on(
    "send-message",
    async ({
      toUserId,
      fromUserId,
      message,
      senderName,
      senderAvatar,
      replyTo,
    }) => {
      const newMessage = await messageUseCases.saveMessage({
        toUserId,
        fromUserId,
        senderName,
        senderAvatar,
        content: message,
        timestamp: new Date(),
        replyTo: replyTo || undefined,
        edited: false,
      });

      const targetSocketId = onlineUsers.get(toUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit("receive-message", newMessage);
      }
    }
  );

  socket.on("group-created", ({ roomId, avatar, name, members }) => {
    members.forEach((user: any) => {
      const socketId = onlineUsers.get(user.id);
      if (socketId) {
        io.to(socketId).emit("new-group-notification", {
          roomId,
          name,
          avatar,
          members,
          createdAt: new Date(),
          type: "group-invite",
        });
      }
    });
  });

  socket.on("edit-message", async ({ messageId, newContent, toUserId }) => {
    const updated = await messageUseCases.editMessage(messageId, newContent);
    const socketId = onlineUsers.get(toUserId);
    if (socketId) {
      io.to(socketId).emit("message-edited", updated);
    }
  });

  socket.on("edit-group-message", async ({ messageId, newContent, roomId }) => {
    const updated = await messageUseCases.editGroupMessage(
      messageId,
      newContent
    );
    io.to(roomId).emit("group-message-edited", updated);
  });

  // handle save group message
  groupMessageSocketHandler(io, socket, messageUseCases);
  socket.on("disconnect", () => {
    let disconnectedUserId: string | null = null;

    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      console.log(`❌ User disconnected: ${disconnectedUserId}`);
    } else {
      console.log(`❌ Unknown socket disconnected: ${socket.id}`);
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // handle user is typing
  socket.on("typing", ({ userId, username, toUserId }) => {
    const targetSocketId = onlineUsers.get(toUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("user-typing", { userId, username });
    }
  });

  // Group typing handler
  socket.on("group-typing", ({ roomId, userId, username, avatar }) => {
    console.log(`✏️ User ${username} is typing in group ${roomId}`);
    io.to(roomId).emit("group-user-typing", {
      roomId,
      username,
      userId,
      avatar,
    });
  });

  socket.on("group-stop-typing", ({ roomId, userId }) => {
    console.log(`⛔️ User ${userId} stopped typing in group ${roomId}`);
    io.to(roomId).emit("group-user-stop-typing", { roomId, userId });
  });

  socket.on("stop-typing", ({ userId, toUserId }) => {
    const targetSocketId = onlineUsers.get(toUserId);
    if (targetSocketId) {
      console.log("Stop");
      io.to(targetSocketId).emit("user-stop-typing", { userId });
    }
  });

  // calling section
  socket.on("call:offer", ({ from, to, offer }) => {
    const socketId = onlineUsers.get(to);
    if (socketId) {
      io.to(socketId).emit("call:incoming", { from, offer });
    }
  });

  socket.on("call:answer", ({ to, answer }) => {
    const socketId = onlineUsers.get(to);
    if (socketId) {
      io.to(socketId).emit("call:answered", { to, answer });
    }
  });

  socket.on("call:ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("call:ice-candidate", { candidate });
  });

  socket.on("call:cancel", ({ to, from }) => {
    const socketId = onlineUsers.get(to);
    if (socketId) {
      io.to(socketId).emit("call:cancelled", { from });
    }
  });

  socket.on("call:reject", ({ to, from }) => {
    io.to(to).emit("call:rejected", { from });
  });

  socket.on("call:end", ({ to }) => {
    io.to(to).emit("call:ended");
  });
});

export { io, onlineUsers };

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
