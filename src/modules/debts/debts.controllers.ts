import { Request, Response } from "express";
import z from "zod";
import ExcelJS from "exceljs";
import {
  createDebt,
  deleteDebt,
  getDebtById,
  getDebts,
  updateDebtStatus,
} from "./debts.service";
import { socketIoService } from "../../services/socketIoService";

const createDebtBodySchema = z.object({
  productName: z.string(),
  amount: z.coerce.number().positive(),
  givenDate: z.coerce.date(),
  dueDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "Due date must be in the future",
  }),
  customerId: z.string().uuid({ version: "v4" }),
});

const paginationQuerySchema = z.object({
  size: z.coerce.number().positive().default(10),
  page: z.coerce.number().positive().default(1),
});

const idValidationSchema = z.object({
  id: z.string().uuid({
    version: "v4",
  }),
});

export const createDebtController = async (req: Request, res: Response) => {
  const { productName, amount, givenDate, dueDate, customerId } =
    createDebtBodySchema.parse(req.body);

  const debt = await createDebt(
    req.user.companyId,
    customerId,
    productName,
    amount,
    givenDate,
    dueDate,
  );

  socketIoService.emitToUser(req.user.id, "new_debt", {
    id: debt.id,
    productName: debt.product_name,
    amount: debt.amount,
    givenDate: debt.given_date,
    dueDate: debt.due_date,
    status: debt.status,
  });
  res.status(201).json(debt);
};

export const getDebtsController = async (req: Request, res: Response) => {
  const { size, page } = paginationQuerySchema.parse(req.query);

  const debts = await getDebts(req.user.companyId, { size, page });
  res.json(debts);
};

export const getDebtByIdController = async (req: Request, res: Response) => {
  const { id } = idValidationSchema.parse(req.params);

  const debt = await getDebtById(req.user.companyId, id);
  if (!debt) {
    return res.status(404).json({ message: "Debt not found" });
  }
  res.json(debt);
};

export const payDebtController = async (req: Request, res: Response) => {
  const { id } = idValidationSchema.parse(req.params);

  const debt = await updateDebtStatus(req.user.companyId, id, "TOLANGAN");

  if (!debt) {
    return res.status(404).json({ message: "Debt not found" });
  }
  socketIoService.emitToUser(req.user.id, "debt_paid", {
    id: debt.id,
    productName: debt.product_name,
    amount: debt.amount,
    givenDate: debt.given_date,
    dueDate: debt.due_date,
    status: debt.status,
  });
  res.json(debt);
};

export const deleteDebtController = async (req: Request, res: Response) => {
  const { id } = idValidationSchema.parse(req.params);

  const success = await deleteDebt(req.user.companyId, id);
  if (!success) {
    return res.status(404).json({ message: "Debt not found" });
  }
  res.status(204).send();
};

export const exportDebtsController = async (req: Request, res: Response) => {
  const debts = await getDebts(req.user.companyId, { size: 1000, page: 1 });

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Debts");

  // Add header row
  worksheet.columns = [
    { header: "ID", key: "id", width: 36 },
    { header: "Customer Name", key: "customer_name", width: 25 },
    { header: "Product Name", key: "product_name", width: 25 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Given Date", key: "given_date", width: 20 },
    { header: "Due Date", key: "due_date", width: 20 },
    { header: "Status", key: "status", width: 15 },
  ];

  // Add data rows
  debts.forEach((debt) => {
    worksheet.addRow({
      id: debt.id,
      customer_name: debt.customer_name,
      product_name: debt.product_name,
      amount: debt.amount,
      given_date: debt.given_date,
      due_date: debt.due_date,
      status: debt.status,
    });
  });

  // Set response headers for Excel
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", 'attachment; filename="debts.xlsx"');

  // Write workbook to response
  await workbook.xlsx.write(res);
  res.end();
};
