import cron from "node-cron";
import { socketIoService } from "../services/socketIoService.js";
import { pool } from "../config/db.js";

// Har 5 minutda ishlaydi
cron.schedule("*/5 * * * *", async () => {
  //   Xullas crone orqali har 5 minutda databasega so'rov yuboramiz va muddati o'tgan qarzlarni topamiz
});
