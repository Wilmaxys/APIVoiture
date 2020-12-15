import { Optional, Model, DataTypes } from "sequelize";
import { db } from '../../config/mysql.config'

const sequelize = db.instance;

export interface CarAttributes {
    id: number;
    immat: string;
    name: string;
    brand: string;
    description: string;
  }

interface CarCreationAttributes extends Optional<CarAttributes, "id"> {}

export class Car extends Model<CarAttributes, CarCreationAttributes> implements CarAttributes {
  public id!: number;
  public immat!: string;
  public name!: string;
  public brand!: string;
  public description!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initialize = () => Car.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    brand: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    immat: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    }
  },
  {
    tableName: "Car",
    sequelize: sequelize
  }
);