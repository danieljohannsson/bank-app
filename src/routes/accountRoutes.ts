import { Router } from "express";
import {
  getAllAccounts,
  getAccountById,
} from "../controllers/accountController";
import { getTransactionsByAccount } from "../controllers/transactionController";

const router = Router();

router.get("/", getAllAccounts);
router.get("/:id", (req, res) => {
  getAccountById(req, res);
});
router.get("/:id/transactions", getTransactionsByAccount);

export default router;
