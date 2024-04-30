import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const databaseName = process.env.DATABASE_NAME;
const databaseUserName = process.env.DATABASE_USERNAME;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseHost = process.env.DATABASE_HOST;
const databaseDialect = process.env.DATABASE_DIALECT;

const sequelize = new Sequelize(
  databaseName,
  databaseUserName,
  databasePassword,
  {
    host: databaseHost,
    dialect: databaseDialect,
  }
);

export default sequelize;
