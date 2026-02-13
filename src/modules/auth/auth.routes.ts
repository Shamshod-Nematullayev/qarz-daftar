import { Router } from "express";
import { changePassword, getUserInfo, login } from "./auth.controllers";
import { catchAsync } from "../../utils/catchAsync";
import { isAuth } from "../../middlewares/isAuth";

const router = Router();

router.post("/login", catchAsync(login));

router.get("/me", isAuth, catchAsync(getUserInfo));

router.put("/change-password", isAuth, catchAsync(changePassword));

export default router;
