import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { users } from "../users";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  res.json({ token });
};
