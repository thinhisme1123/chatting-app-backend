import { Request, Response } from "express";
import { loginUser } from "../../../application/auth/login-use-case.interface";
import { registerUser } from "../../../application/auth/register-use-case.interface";
import { generateToken } from "../../../utils/jwt";
import { UserModel } from "../../../infrastructure/db/models/user-model";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    const token = generateToken(result.userId);

    res.json({
      user: result.user,
      token,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message });
  }
};

export const registerController = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const result = await registerUser(email, username, password);
    res.status(201).json({ message: "Đăng ký thành công", ...result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const { userId } = req.body; // hoặc lấy từ JWT decode middleware nếu có

  try {
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Lỗi đăng xuất" });
  }
};

export const getAllUsersExceptMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentUserId = req.query.currentUserId as string;
    if (!currentUserId) {
      res.status(400).json({ error: "Missing user ID" });
      return;
    }

    const users = await UserModel.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    );

    const transformedUsers = users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isOnline: true, 
    }));

    res.status(200).json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Temporary in-memory reset code store
const resetCodes: Record<string, { code: string; expires: number }> = {};

// ===== Forgot Password (already shown earlier) =====
export const forgetPasswordController = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    // generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    // store with 15-minute expiry
    resetCodes[email] = { code: resetCode, expires: Date.now() + 15 * 60 * 1000 };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `Your reset code is: ${resetCode}\n\nOr click: ${process.env.CLIENT_URL}/reset-password?email=${email}&code=${resetCode}`,
    });

    res.json({ message: "Reset email sent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to send reset email" });
  }
};

// ===== Verify Reset Code =====
export const verifyResetCodeController = async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;
  const record = resetCodes[email];

  if (!record) {
    res.status(400).json({ message: "No reset request found for this email" });
    return;
  }

  if (record.expires < Date.now()) {
    res.status(400).json({ message: "Reset code expired" });
    return;
  }

  if (record.code !== code) {
    res.status(400).json({ message: "Invalid reset code" });
    return;
  }

  res.json({ message: "Code verified successfully" });
};

// ===== Reset Password =====
export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  const { email, code, newPassword } = req.body;
  const record = resetCodes[email];

  if (!record) {
    res.status(400).json({ message: "No reset request found for this email" });
    return;
  }

  if (record.expires < Date.now()) {
    res.status(400).json({ message: "Reset code expired" });
    return;
  }

  if (record.code !== code) {
    res.status(400).json({ message: "Invalid reset code" });
    return;
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // TODO: update password in DB (this is a fake example)
  // await userRepository.updatePassword(email, hashedPassword);

  // cleanup reset code
  delete resetCodes[email];

  res.json({ message: "Password reset successfully" });
};
