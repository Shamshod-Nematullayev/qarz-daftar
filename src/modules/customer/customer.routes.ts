import { Router } from "express";
import {
  createCustomerController,
  deleteCustomerController,
  getCustomerByIdController,
  getCustomersController,
} from "./customer.controllers";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.post("/", catchAsync(createCustomerController));

router.get("/", catchAsync(getCustomersController));

router.get("/:id", catchAsync(getCustomerByIdController));

router.delete("/:id", catchAsync(deleteCustomerController));

export default router;
