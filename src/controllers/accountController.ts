import { Request, Response } from "express";
import { accounts } from "../data";

export const getAllAccounts = (req: Request, res: Response) => {
  res.json(accounts);
};

export const getAccountById = (req: Request, res: Response) => {
  const account = accounts.find((acc) => acc.id === req.params.id);
  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }
  res.json(account);
};
