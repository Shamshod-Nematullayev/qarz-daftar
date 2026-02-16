import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  createDebtController,
  deleteDebtController,
  exportDebtsController,
  getDebtByIdController,
  getDebtsController,
  payDebtController,
} from "./debts.controllers";

const router = Router();

router.post("/", catchAsync(createDebtController));

router.get("/", catchAsync(getDebtsController));

router.get("/export", catchAsync(exportDebtsController));

router.get("/:id", catchAsync(getDebtByIdController));

router.put("/:id/pay", catchAsync(payDebtController));

router.delete("/:id", catchAsync(deleteDebtController));

export default router;
