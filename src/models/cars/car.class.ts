import {
  Optional, Model, DataTypes, HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from "sequelize";
import { db } from '../../config/mysql.config';
import { Reservation } from '../reservations/reservation.class';

const sequelize = db.instance;

export interface CarAttributes {
  id: number;
  immat: string;
  name: string;
  brand: string;
  description: string;
  dailyPrice: number;
}

interface CarCreationAttributes extends Optional<CarAttributes, "id"> { }

export class Car extends Model<CarAttributes, CarCreationAttributes> implements CarAttributes {
  public id!: number;
  public immat!: string;
  public name!: string;
  public brand!: string;
  public description!: string;
  public dailyPrice!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getProjects!: HasManyGetAssociationsMixin<Reservation>; // Note the null assertions!
  public addProject!: HasManyAddAssociationMixin<Reservation, number>;
  public hasProject!: HasManyHasAssociationMixin<Reservation, number>;
  public countProjects!: HasManyCountAssociationsMixin;
  public createProject!: HasManyCreateAssociationMixin<Reservation>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly reservations?: Reservation[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    reservations: Association<Car, Reservation>;
  };

}

export const initialize = {
  table: () => {
    Car.init(
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
        },
        dailyPrice: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        }
      },
      {
        tableName: "Car",
        sequelize: sequelize
      }
    )
  },
  fk: () => {
    Car.hasMany(Reservation, {
      sourceKey: "id",
      foreignKey: "carId",
      as: "reservations", // this determines the name in `associations`!
    });
  }
};