import { Budget } from "../models/budget.js";
import { Category } from "../models/category.js";
import io from "../index.js";

export const createCategory = async (req, res) => {
  const { budgetId } = req.params;
  const { name, limit } = req.body;

  try {
    // Obtener el presupuesto asociado a la categoría
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Crear la categoría en la base de datos
    const original_limit = limit;
    const category = await Category.create({
      name,
      limit,
      original_limit,
      budget_id: budget.id,
    });

    // Emitir un evento WebSocket informando sobre la creación de la categoría
    io.emit("category_created", category);

    res.json(category);
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
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
