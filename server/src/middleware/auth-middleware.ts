import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../infrastructure/db/models/user-model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    (req as any).user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    next();
  } catch (err) {
    res
      .status(401)
      .json({ error: "Unauthorized: Invalid token or internal error" });
  }
};
// khác nhau về JWT_SECRECT có thể dẫn đến không thể truy cập => kiểm tra token khi mới login vào
