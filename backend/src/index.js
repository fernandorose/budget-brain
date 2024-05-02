import express from "express";
import sequelize from "./lib/sequelize.js";
import OpenAI from "openai";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import "./models/budget.js";
import "./models/category.js";
import "./models/transaction.js";
import "./models/user.js";

import userRoutes from "./routes/user.js";
import budgetRoutes from "./routes/budget.js";
import categoryRoutes from "./routes/category.js";
import transactionRoutes from "./routes/transaction.js";
import { User } from "./models/user.js";
import { Budget } from "./models/budget.js";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    credentials: false,
  },
});

// Objeto para almacenar el contexto de la conversación por cada cliente
const conversationContext = {};

app.use(express.json());
app.use(cors());
app.use("/api", userRoutes);
app.use("/api", budgetRoutes);
app.use("/api", categoryRoutes);
app.use("/api", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", async (message) => {
    if (!message) {
      return;
    }
    try {
      // Obtener el contexto de la conversación para este cliente
      const context = conversationContext[socket.id] || [];

      // Obtener los datos de la base de datos utilizando Sequelize
      const users = await User.findAll();
      const budgets = await Budget.findAll();

      // Procesar los datos y generar un mensaje para el bot
      let userNames = "Usuarios en la base de datos:\n";
      let budgetData = "Presupuestos en la base de datos:\n";
      users.forEach((user) => {
        userNames += `Nombre:  ${user.first_name}\n`;
      });
      budgets.forEach((budget) => {
        budgetData += `Nombre:  ${budget.name}\n`;
      });
      // Generar el mensaje para el bot que incluye los datos de la tabla
      const botMessage = `Se han encontrado ${users.length} usuarios:\n${userNames}\nSe han encontrado ${budgets.length} presupuestos:\n${budgetData}`;

      // Enviar el mensaje del usuario junto con los datos de la tabla al bot
      const response = await openai.chat.completions.create({
        messages: [
          ...context,
          { role: "user", content: message },
          { role: "assistant", content: botMessage },
        ],
        model: "gpt-3.5-turbo",
      });

      // Actualizar el contexto de la conversación
      conversationContext[socket.id] = [
        ...context,
        { role: "user", content: message },
        { role: "assistant", content: response.choices[0].message.content },
      ];

      // Enviar la respuesta del bot al cliente
      socket.emit("message", response.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
      socket.emit("message", "Sorry, an error occurred.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const main = async () => {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  await sequelize.sync({ force: false });
};

main();
