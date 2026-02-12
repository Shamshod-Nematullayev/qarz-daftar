import { pool } from "../config/db";

export const initTables = async () => {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  //   COMPANIES
  await pool.query(`CREATE TABLE IF NOT EXISTS companies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

  // USERS
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  // CUSTOMERS
  await pool.query(`CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL, UNIQUE (company_id, phone),
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  // DEBTS
  await pool.query(`CREATE TABLE IF NOT EXISTS debts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
        given_date TIMESTAMP NOT NULL,
        due_date TIMESTAMP NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'KUTILMOQDA' CHECK (status IN ('KUTILMOQDA', 'TOLANGAN', 'MUDDAT_OTGAN')),
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  // INDEXES
  await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_debts_customer_id
  ON debts(customer_id);
`);

  await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_debts_status
  ON debts(status);
`);

  console.log("Tables initialized successfully");
};
