import express from "express";
import * as budgetServices from "../services/budget.js";

const router = express.Router();

router
  .get("/budgets/get/:userId", budgetServices.getAllBudgetsByUserId)
  .get(
    "/budgets/get/:userId/:budgetId",
    budgetServices.getBudgetByUserIdAndBudgetId
  )
  .get("/budget/get/:budgetId", budgetServices.getBudgetById)
  .delete("/budget/delete/:budgetId", budgetServices.deleteBudgetById)
  .post("/budgets/create/:userId", budgetServices.createBudget);

export default router;
