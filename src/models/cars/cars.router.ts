/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import { Car } from "./car.class";
import auth from '../../middleware/Auth';
/**
 * Router Definition
 */

export const carsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET cars/
carsRouter.get("/", auth, async (req: Request, res: Response) => {
    try {
        const cars: Car[] = await Car.findAll();
        res.status(200).send(cars);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// GET cars/:id
carsRouter.get("/:id", auth, async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const car : Car | null = await Car.findOne({
            where: {
              id: id
            }
        });

        res.status(200).send(car);
    } catch (e) {
        res.status(404).send(e.message);
    }
});


// POST cars/
carsRouter.post("/", auth, async (req: Request, res: Response) => {
    try {
        const car : Car = req.body;

        await Car.create(car);

        res.sendStatus(201);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// PUT cars/
carsRouter.put("/", auth, async (req: Request, res: Response) => {
    try {
        const car: Car = req.body;

        await Car.update(car, {
            where: {
              id: car.id
            }
          });

        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// DELETE cars/:id
carsRouter.delete("/:id", auth, async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        
        await Car.destroy({
            where: {
              id: id
            }
        });

        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e.message);
    }
});