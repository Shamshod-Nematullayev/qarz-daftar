import { pool } from "../../config/db";

export const createDebt = async (
  companyId: number,
  customerId: string,
  productName: string,
  amount: number,
  givenDate: Date,
  dueDate: Date,
) => {
  const { rows } = await pool.query(
    `
        INSERT INTO debts (company_id, customer_id, product_name, amount, given_date, due_date) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `,
    [companyId, customerId, productName, amount, givenDate, dueDate],
  );
  return rows[0];
};

export const getDebts = async (
  companyId: number,
  { size, page }: { size: number; page: number },
) => {
  const offset = (page - 1) * size;
  const { rows } = await pool.query(
    `SELECT d.*, c.name AS customer_name FROM debts d JOIN customers c ON d.company_id = $1 AND d.customer_id = c.id ORDER BY d.created_at DESC LIMIT $2 OFFSET $3`,
    [companyId, size, offset],
  );
  return rows;
};

export const getDebtById = async (companyId: number, id: string) => {
  const { rows } = await pool.query(
    `SELECT d.*, c.name AS customer_name FROM debts d JOIN customers c ON d.company_id = $1 AND d.customer_id = c.id AND d.id = $2`,
    [companyId, id],
  );
  return rows[0];
};

export const updateDebtStatus = async (
  companyId: number,
  id: string,
  status: "KUTILMOQDA" | "TOLANGAN" | "MUDDAT_OTGAN",
) => {
  const { rows } = await pool.query(
    `UPDATE debts SET status = $1 WHERE company_id = $2 AND id = $3 RETURNING *`,
    [status, companyId, id],
  );
  return rows[0];
};

export const deleteDebt = async (companyId: number, id: string) => {
  const { rowCount } = await pool.query(
    `DELETE FROM debts WHERE company_id = $1 AND id = $2`,
    [companyId, id],
  );
  return rowCount !== null && rowCount > 0;
};
