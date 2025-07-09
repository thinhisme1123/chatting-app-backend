import jwt from "jsonwebtoken";

const EXPIRES_IN = "7d"; 

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: EXPIRES_IN,
  });
}
// khác nhau về JWT_SECRECT lúc mới login vào có thể dẫn đến lỗi không thể đi qua lớp middleware
