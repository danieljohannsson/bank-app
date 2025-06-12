import { Router } from "express";
import {
  getAllAccounts,
  getAccountById,
} from "../controllers/accountController";
import { getTransactionsByAccount } from "../controllers/transactionController";

const router = Router();

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: List all accounts
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: A list of accounts
 */
router.get("/", getAllAccounts);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Get a single account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account found
 *       404:
 *         description: Account not found
 */
router.get("/:id", (req, res) => {
  getAccountById(req, res);
});

/**
 * @swagger
 * /accounts/{id}/transactions:
 *   get:
 *     summary: List transactions for an account
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get("/:id/transactions", getTransactionsByAccount);

export default router;
