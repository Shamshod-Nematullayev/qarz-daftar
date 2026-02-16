import { Request, Response } from "express";
import { getStats } from "./stats.service";

export const getStatsController = async (req: Request, res: Response) => {
  const stats = await getStats(req.user.companyId);
  res.json(stats);
};
