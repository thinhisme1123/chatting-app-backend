"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRoutes = void 0;
const auth_route_1 = __importDefault(require("./auth-route"));
const message_route_1 = __importDefault(require("./message-route"));
const user_route_1 = __importDefault(require("./user-route"));
const friend_route_1 = __importDefault(require("./friend-route"));
const chat_route_1 = __importDefault(require("./chat-route"));
const mainRoutes = (app) => {
    app.use("/auth", auth_route_1.default);
    app.use("/messages", message_route_1.default);
    app.use("/user", user_route_1.default);
    app.use("/friend", friend_route_1.default);
    app.use("/chatroom", chat_route_1.default);
};
exports.mainRoutes = mainRoutes;
