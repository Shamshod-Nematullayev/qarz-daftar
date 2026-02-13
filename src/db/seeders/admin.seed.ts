import bcrypt from "bcrypt";
import { pool } from "../../config/db";

export async function seedAdmin() {
  const adminExists = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    ["admin"],
  );

  if (adminExists.rows.length === 0) {
    const hashedPassword = await bcrypt.hash("StrongPassword123", 10);

    const { rows } = await pool.query(
      `INSERT INTO companies (name) VALUES ($1) RETURNING id`,
      ["Admin Company"],
    );

    await pool.query(
      `INSERT INTO users (username, password, company_id)
       VALUES ($1, $2, $3)`,
      ["admin", hashedPassword, rows[0].id],
    );

    console.log("✅ Admin user created");
  }
}
