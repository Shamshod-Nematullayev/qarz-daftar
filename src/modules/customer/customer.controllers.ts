import z from "zod";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
} from "./customer.service";
import { Request, Response } from "express";

const createCustomerBodySchema = z.object({
  name: z.string(),
  phone: z.string().regex(/^\d{9}$/, "Phone number must be 9 digits"),
});

const idValidationSchema = z.object({
  id: z.string().uuid({
    version: "v4",
  }),
});

export const createCustomerController = async (req: Request, res: Response) => {
  const { name, phone } = createCustomerBodySchema.parse(req.body);
  const customer = await createCustomer(req.user.companyId, name, phone);
  res.status(201).json(customer);
};

export const getCustomersController = async (req: Request, res: Response) => {
  const rows = await getCustomers(req.user.companyId);
  res.json(rows);
};

export const getCustomerByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = idValidationSchema.parse(req.params);
  const customer = await getCustomerById(req.user.companyId, id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json(customer);
};

export const deleteCustomerController = async (req: Request, res: Response) => {
  const { id } = idValidationSchema.parse(req.params);
  if (!id) {
    return res.status(400).json({ message: "Customer ID is required" });
  }
  const success = await deleteCustomer(req.user.companyId, id);
  if (!success) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.status(204).send();
};
