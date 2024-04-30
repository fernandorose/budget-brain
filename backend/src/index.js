import express from "express";
import cors from "cors";
import sequelize from "./lib/sequelize.js";

import "./models/budget.js";
import "./models/category.js";
import "./models/transaction.js";
import "./models/user.js";

import userRoutes from "./routes/user.js";
import budgetRoutes from "./routes/budget.js";
import categoryRoutes from "./routes/category.js";
import transactionRoutes from "./routes/transaction.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", budgetRoutes);
app.use("/api", categoryRoutes);
app.use("/api", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const main = async () => {
  app.listen(PORT);
  await sequelize.sync({ force: false });
};

main();
