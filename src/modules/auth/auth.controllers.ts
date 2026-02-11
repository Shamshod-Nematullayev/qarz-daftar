import { Request, Response } from "express";
import z from "zod";

const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const login = (req: Request, res: Response) => {
  const { username, password } = loginSchema.parse(req.body);

  // Handle login logic here, e.g., check credentials, generate token, etc.
  res.json({ message: "Login successful", user: username });
};
