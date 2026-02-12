import { pool } from "../../config/db";

export const createCustomer = async (
  companyId: number,
  name: string,
  phone: string,
) => {
  try {
    const { rows } = await pool.query(
      `
        INSERT INTO customers (company_id, name, phone) VALUES ($1, $2, $3) RETURNING *
      `,
      [companyId, name, phone],
    );
    return rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Phone already exists");
    }
    throw error;
  }
};

export const getCustomers = async (companyId: number) => {
  const { rows } = await pool.query(
    `SELECT * FROM customers WHERE company_id = $1 ORDER BY created_at DESC`,
    [companyId],
  );
  return rows;
};

export const getCustomerById = async (companyId: number, id: string) => {
  const { rows } = await pool.query(
    `SELECT * FROM customers WHERE company_id = $1 AND id = $2`,
    [companyId, id],
  );
  return rows[0];
};

export const deleteCustomer = async (companyId: number, id: string) => {
  const { rowCount } = await pool.query(
    `DELETE FROM customers WHERE company_id = $1 AND id = $2`,
    [companyId, id],
  );
  return rowCount !== null && rowCount > 0;
};
