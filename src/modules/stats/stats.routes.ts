import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getStatsController } from "./stats.controllers";

const router = Router();

router.get("/", catchAsync(getStatsController));

export default router;
