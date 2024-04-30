import express from "express";
import * as categoryServices from "../services/category.js";

const router = express.Router();

router
  .get("/categories/get/:budgetId", categoryServices.getCategoriesByBudgetId)
  .post("/categories/create/:budgetId", categoryServices.createCategory);

export default router;
