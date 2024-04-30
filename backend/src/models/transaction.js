import { DataTypes, NOW, UUIDV4 } from "sequelize";
import sequelize from "../lib/sequelize.js";
import { User } from "./user.js";
import { Category } from "./category.js";

export const Transaction = sequelize.define(
  "transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
    },
    description: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
  },
  {
    timestamps: false,
  }
);

Transaction.belongsTo(User, { foreignKey: "user_id" });
Transaction.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Transaction, { foreignKey: "category_id" });
