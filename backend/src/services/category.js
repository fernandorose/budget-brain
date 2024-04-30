import { Budget } from "../models/budget.js";
import { Category } from "../models/category.js";

export const createCategory = async (req, res) => {
  const { budgetId } = req.params;
  const { name, limit } = req.body;
  const getBudget = await Budget.findByPk(budgetId);
  const original_limit = limit;
  const create = await Category.create({
    name,
    limit,
    original_limit,
    budget_id: getBudget.id,
  });
  res.json(create);
};

export const getCategoriesByBudgetId = async (req, res) => {
  const { budgetId } = req.params;

  try {
    // Obtener el presupuesto por su ID
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }

    // Una vez que tienes el presupuesto, podrías acceder a sus categorías si están relacionadas en el modelo
    const categories = await budget.getCategories(); // Esto asume que hay una relación entre Budget y Category en tu modelo

    // Devolver las categorías encontradas
    return res.status(200).json(categories);
  } catch (error) {
    console.error(
      "Error al obtener las categorías por ID de presupuesto:",
      error
    );
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
