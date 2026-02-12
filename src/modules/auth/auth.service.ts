import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (
  username: string,
  password: string,
): Promise<string> => {
  const user = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  const hashedPassword = user.rows[0].password;

  if (!bcrypt.compareSync(password, hashedPassword)) {
    throw new Error("Invalid password");
  }

  const accessToken = jwt.sign(
    {
      userId: user.rows[0].id,
      companyId: user.rows[0].company_id,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  return accessToken;
};

export const getUserInfo = async (userId: string) => {
  const { rows } = await pool.query(
    `SELECT id, username, company_id FROM users WHERE id = $1`,
    [userId],
  );
  return rows[0];
};
