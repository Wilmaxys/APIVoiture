/**
 * Data Model Interfaces
 */

import { Car } from "./car.interface";
import { Cars } from "./cars.interface";

/**
 * In-Memory Store
 */

const cars: Cars = {
    1: {
        id: 1,
        immat: "BS-324-XV",
        name: "Model S",
        brand: "Tesla",
        description: "Ca fume le bitume."
    },
    2: {
        id: 1,
        immat: "BS-325-XV",
        name: "Model 3",
        brand: "Tesla",
        description: "Ca fume le bitume mais un peu moins que la Tesla Model S."
    },
    3: {
        id: 1,
        immat: "BS-326-XV",
        name: "CyberTruck",
        brand: "Tesla",
        description: "Bienvenue dans Cyberpunk 2077."
    }
};

/**
 * Service Methods
 */

export const findAll = async (): Promise<Cars> => {
    return cars;
};

export const find = async (id: number): Promise<Car> => {
    const record: Car = cars[id];
    if (record) {
        return record;
    }
    throw new Error("No record found");
};

export const create = async (newCar: Car): Promise<void> => {
    const id = new Date().valueOf();
    cars[id] = {
        ...newCar,
        id
    };
};

export const update = async (updatedCar: Car): Promise<void> => {
    if (cars[updatedCar.id]) {
        cars[updatedCar.id] = updatedCar;
        return;
    }

    throw new Error("No record found to update");
};

export const remove = async (id: number): Promise<void> => {
    const record: Car = cars[id];

    if (record) {
        delete cars[id];
        return;
    }

    throw new Error("No record found to delete");
};