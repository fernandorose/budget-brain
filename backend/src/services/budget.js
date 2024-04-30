import { Budget } from "../models/budget.js";
import { User } from "../models/user.js";

export const getAllBudgetsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const budgets = await Budget.findAll({
      where: { user_id: userId },
    });

    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBudgetByUserIdAndBudgetId = async (req, res) => {
  try {
    const { userId, budgetId } = req.params;
    const budget = await Budget.findOne({
      where: { id: budgetId, user_id: userId },
    });

    if (!budget) {
      return res.status(404).json({ error: "Budget not found for this user" });
    }

    res.json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBudgetById = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json(error);
  }
};

export const createBudget = async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;
  const getUser = await User.findByPk(userId);
  const create = await Budget.create({
    name,
    user_id: getUser.id,
  });
  res.json(create);
};