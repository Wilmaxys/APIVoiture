import { Optional, Model, DataTypes } from "sequelize";
import { db } from '../../config/mysql.config'

const sequelize = db.instance;

export interface ReservationAttributes {
    id: number;
    carId: number;
    begin: Date;
    end: Date;
}

interface ReservationCreationAttributes extends Optional<ReservationAttributes, "id"> { }

export class Reservation extends Model<ReservationAttributes, ReservationCreationAttributes> implements ReservationAttributes {
    public id!: number;
    public carId!: number;
    public begin!: Date;
    public end!: Date;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initialize = {
    table: () => {
        Reservation.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                carId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                begin: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                end: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                tableName: "Reservation",
                sequelize: sequelize
            }
        );
    }
};