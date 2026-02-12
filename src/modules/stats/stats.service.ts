import { pool } from "../../config/db";

export const getStats = async (company_id: number) => {
  const [totalCustomers, totalDebtAmount, overdueCount] = await Promise.all([
    pool
      .query(`SELECT COUNT(*) FROM customers WHERE company_id = $1`, [
        company_id,
      ])
      .then(({ rows }) => rows[0].count),
    pool
      .query(`SELECT SUM(amount) FROM debts WHERE company_id = $1`, [
        company_id,
      ])
      .then(({ rows }) => rows[0].sum),
    pool
      .query(
        `SELECT COUNT(*) FROM debts WHERE company_id = $1 AND status = 'MUDDAT_OTGAN'`,
        [company_id],
      )
      .then(({ rows }) => rows[0].count),
  ]);

  return {
    totalCustomers,
    totalDebtAmount,
    overdueCount,
  };
};
