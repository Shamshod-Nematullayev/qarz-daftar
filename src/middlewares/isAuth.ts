import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      companyId: number;
      username: string;
    };

    req.user = {
      id: decoded.userId,
      companyId: decoded.companyId,
      username: decoded.username,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
