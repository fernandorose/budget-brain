import { Budget } from "../models/budget.js";
import { Category } from "../models/category.js";
import { Transaction } from "../models/transaction.js";
import { User } from "../models/user.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const getUsers = async (req, res) => {
  const get = await User.findAll({
    include: [
      {
        model: Budget,
        include: [
          {
            model: Category,
            include: [
              {
                model: Transaction,
              },
            ],
          },
        ],
      },
    ],
  });
  res.json(get);
};

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const create = await User.create({
    first_name,
    last_name,
    email,
    password: hashPassword,
  });
  res.json(create);
};

export const loginUser = async (req, res) => {
  const secret = process.env.SECRET;
  const { email, password } = req.body;
  const getUser = await User.findOne({
    where: {
      email: email,
    },
  });
  const validatePassword = await bcrypt.compare(password, getUser.password);
  if (!validatePassword) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }
  const sessionToken = jwt.sign(
    {
      userId: getUser.id,
      userName: `${getUser.first_name.toLowerCase()}_${getUser.last_name
        .toLowerCase()
        .replace(/\s+/g, "_")}`,
    },
    secret,
    {
      expiresIn: "1h",
    }
  );
  res.json(sessionToken);
};
