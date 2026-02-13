import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../middlewares/globalErrorHandler";

export const loginService = async (
  username: string,
  password: string,
): Promise<string> => {
  const user = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  if (user.rows.length === 0) {
    throw new BadRequestError("User not found");
  }

  const hashedPassword = user.rows[0].password;

  if (!bcrypt.compareSync(password, hashedPassword)) {
    throw new BadRequestError("Invalid password");
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

export const getUserInfoService = async (
  userId: string,
): Promise<{
  id: string;
  username: string;
  companyId: number;
}> => {
  const { rows } = await pool.query(
    `SELECT id, username, company_id FROM users WHERE id = $1`,
    [userId],
  );
  return rows[0];
};

export const changePasswordService = async (
  userId: string,
  newPassword: string,
  oldPassword: string,
) => {
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

  if (user.rows.length === 0) {
    throw new BadRequestError("User not found");
  }

  const currentHashedPassword = user.rows[0].password;
  if (!bcrypt.compareSync(oldPassword, currentHashedPassword)) {
    throw new BadRequestError("Invalid old password");
  }

  await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [
    hashedPassword,
    userId,
  ]);
};
