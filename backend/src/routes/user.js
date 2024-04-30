import express from "express";
import * as userServices from "../services/users.js";

const router = express.Router();

router
  .get("/users/get", userServices.getUsers)
  .post("/users/login", userServices.loginUser)
  .post("/users/create", userServices.createUser);

export default router;
