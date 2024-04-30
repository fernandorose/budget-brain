import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../lib/sequelize.js";

export const Category = sequelize.define(
  "category",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    limit: {
      type: DataTypes.DECIMAL(15, 2),
    },
    original_limit: {
      type: DataTypes.DECIMAL(15, 2),
    },
  },
  {
    timestamps: false,
  }
);
