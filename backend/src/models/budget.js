import { DataTypes, NOW, UUIDV4 } from "sequelize";
import sequelize from "../lib/sequelize.js";
import { User } from "./user.js";
import { Category } from "./category.js";

export const Budget = sequelize.define(
  "budget",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
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

Budget.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Budget, { foreignKey: "user_id" });

Budget.hasMany(Category, { foreignKey: "budget_id" });
Category.belongsTo(Budget, { foreignKey: "budget_id" });
