import { Budget } from "../models/budget.js";
import { User } from "../models/user.js";
import io from "../index.js";

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

// export const createBudget = async (req, res) => {
//   const { userId } = req.params;
//   const { name } = req.body;
//   const getUser = await User.findByPk(userId);
//   const create = await Budget.create({
//     name,
//     user_id: getUser.id,
//   });
//   res.json(create);
// };

// export const deleteBudgetById = async (req, res) => {
//   const { budgetId } = req.params;

//   try {
//     // Buscar el presupuesto por su identificador
//     const budget = await Budget.findByPk(budgetId);

//     // Verificar si el presupuesto existe
//     if (!budget) {
//       return res.status(404).json({ error: "Presupuesto no encontrado" });
//     }

//     // Eliminar el presupuesto
//     await budget.destroy();

//     res.status(204).end(); // Respuesta exitosa sin contenido
//   } catch (error) {
//     console.error("Error al eliminar el presupuesto:", error.message);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// };

export const createBudget = async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    // Crear el presupuesto en la base de datos
    const create = await Budget.create({
      name,
      user_id: userId, // No es necesario buscar al usuario por su id, ya que userId ya es el id del usuario
    });

    // Emitir un evento WebSocket informando sobre la creación del presupuesto
    io.emit("budget_created", create);

    res.json(create);
  } catch (error) {
    console.error("Error al crear el presupuesto:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteBudgetById = async (req, res) => {
  const { budgetId } = req.params;

  try {
    // Buscar el presupuesto por su identificador
    const budget = await Budget.findByPk(budgetId);

    // Verificar si el presupuesto existe
    if (!budget) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }

    // Eliminar el presupuesto
    await budget.destroy();

    // Emitir un evento WebSocket informando sobre la eliminación del presupuesto
    io.emit("budget_deleted", budgetId);

    res.status(204).end(); // Respuesta exitosa sin contenido
  } catch (error) {
    console.error("Error al eliminar el presupuesto:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
