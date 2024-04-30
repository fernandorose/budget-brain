import { Category } from "../models/category.js";
import { Transaction } from "../models/transaction.js";
import { User } from "../models/user.js";

export const createTransaction = async (req, res) => {
  const { userId, categoryId } = req.params;
  const { amount, description, type } = req.body;

  try {
    // Buscar el usuario y la categoría
    const getUser = await User.findByPk(userId);
    const getCategory = await Category.findByPk(categoryId);

    if (!getUser || !getCategory) {
      return res
        .status(404)
        .json({ error: "Usuario o categoría no encontrada" });
    }

    let updatedLimit;
    if (type === "expense") {
      // Restar el monto de la transacción al límite original de la categoría
      updatedLimit = parseFloat(getCategory.limit) - amount;
    } else if (type === "income") {
      // Sumar el monto de la transacción al límite original de la categoría
      updatedLimit = parseFloat(getCategory.limit) + amount;
    }

    // Actualizar el límite de la categoría en la base de datos
    await Category.update(
      { limit: updatedLimit },
      { where: { id: categoryId } }
    );

    // Crear la transacción
    const create = await Transaction.create({
      amount,
      description,
      type,
      user_id: getUser.id,
      category_id: getCategory.id,
    });

    res.json(create);
  } catch (error) {
    console.error("Error al crear la transacción:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTransactionsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Obtener la categoría por su ID
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Una vez que tienes la categoría, podrías acceder a sus transacciones si están relacionadas en el modelo
    const transactions = await category.getTransactions(); // Esto asume que hay una relación entre Category y Transaction en tu modelo

    // Devolver las transacciones encontradas
    return res.status(200).json(transactions);
  } catch (error) {
    console.error(
      "Error al obtener las transacciones por ID de categoría:",
      error
    );
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
