import cron from "node-cron";
import { socketIoService } from "../services/socketIoService.js";
import { pool } from "../config/db.js";

export async function startDebtCron() {
  // Works every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    const dueDebts = await pool.query(
      `SELECT d.id, d.company_id, d.customer_id, d.product_name, d.amount, d.due_date, c.name AS customer_name 
     FROM debts d 
     JOIN customers c ON d.company_id = c.company_id AND d.customer_id = c.id 
     WHERE d.status = 'KUTILMOQDA' AND d.due_date < NOW()`,
    );

    dueDebts.rows.forEach((debt) => {
      socketIoService.emitToCompany(
        debt.company_id,
        "due_debt",
        `Debt for ${debt.product_name} owed by ${debt.customer_name} is overdue!`,
      );
    });

    await pool.query(
      `UPDATE debts SET status = 'MUDDAT_OTGAN' WHERE status = 'KUTILMOQDA' AND due_date < NOW()`,
    );
  });
}
