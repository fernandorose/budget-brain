import express from "express";
import * as transactionService from "../services/transaction.js";

const router = express.Router();

router
  .get(
    "/transactions/get/:categoryId",
    transactionService.getTransactionsByCategoryId
  )
  .post(
    "/transactions/create/:userId/:categoryId",
    transactionService.createTransaction
  );

export default router;
