import { Request, Response } from "express";
import z from "zod";
import {
  changePasswordService,
  getUserInfoService,
  loginService,
} from "./auth.service";

const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const login = async (req: Request, res: Response) => {
  const { username, password } = loginSchema.parse(req.body);

  const token = await loginService(username, password);

  res.json({ token });
};

export const getUserInfo = async (req: Request, res: Response) => {
  const userId = req.user?.id; // Assuming you have middleware to set req.user
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userInfo = await getUserInfoService(userId);
  res.json(userInfo);
};

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

  await changePasswordService(userId, newPassword, oldPassword);

  res.json({ message: "Password changed successfully" });
};
