import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  // Handle login logic here
  res.send("Login endpoint");
});

router.get("/me", (req, res) => {
  // Handle fetching user info logic here
  res.send("User info endpoint");
});

export default router;
