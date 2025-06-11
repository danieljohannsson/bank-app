import { Request, Response } from "express";
import { transactions } from "../data";

export const getTransactionsByAccount = (req: Request, res: Response) => {
  const accountId = req.params.id;
  const accountTransactions = transactions.filter(
    (tx) => tx.uniqueId === accountId
  );
  res.json(accountTransactions);
};
