
import * as dotenv from "dotenv";
import { Car } from '../models/cars/car.class'
const Sequelize = require("sequelize");
dotenv.config();

const instance = new Sequelize(process.env.DB, process.env.DBUSER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT,
});

export const db : Record<string,any> = {
  sequelize: Sequelize,
  instance: instance,
}