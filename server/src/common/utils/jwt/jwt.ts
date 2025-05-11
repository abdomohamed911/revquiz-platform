import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret";

export const generateToken = (userId: any) => {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: "365d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
