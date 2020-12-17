import { initialize as initCar } from './cars/car.class';
import { initialize as initRes } from './reservations/reservation.class';
import { Car } from './cars/car.class';
import { Reservation } from './reservations/reservation.class';
import moment from 'moment';

export const databaseTableInitialization = () => {
    initCar.table();
    initRes.table();
}

export const databaseForeignJeyInitialization = () => {
    initCar.fk();
}

export const databseDataInitialization = async () => {
    let instance = await Car.create(
        {
            immat: "BS-264-VV",
            name: "Model S",
            brand: "Tesla",
            description: "Ca fume le bitume",
            dailyPrice: 120
        }
    );
    await Reservation.create(
        {
            carId: instance.getDataValue("id"),
            begin: moment.utc("12/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
            end: moment.utc("13/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
        }
    )
    await Reservation.create(
        {
            carId: instance.getDataValue("id"),
            begin: moment.utc("14/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
            end: moment.utc("18/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
        }
    )
    await Reservation.create(
        {
            carId: instance.getDataValue("id"),
            begin: moment.utc("19/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
            end: moment.utc("19/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
        }
    )
    instance = await Car.create(
        {
            immat: "BS-264-VV",
            name: "Model 3",
            brand: "Tesla",
            description: "Ca fume le bitume un peu moins mais quand même pas trop mal.",
            dailyPrice: 220
        }
    );
    await Reservation.create(
        {
            carId: instance.getDataValue("id"),
            begin: moment.utc("12/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
            end: moment.utc("13/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
        }
    )
    await Reservation.create(
        {
            carId: instance.getDataValue("id"),
            begin: moment.utc("14/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
            end: moment.utc("18/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
        }
    )
    await Reservation.create(
        {
            carId: instance.getDataValue("id"),
            begin: moment.utc("19/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
            end: moment.utc("19/12/2020", "DD/MM/YYYY", "Europe/Paris").toDate(),
        }
    )
}