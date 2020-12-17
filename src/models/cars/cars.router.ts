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
/**
 * @swagger
 *
 * definitions:
 *   NewCar:
 *     type: object
 *     required:
 *       - immat
 *       - name
 *       - brand
 *       - description
 *     properties:
 *       name:
 *         type: string
 *       price:
 *         type: string
 *       brand:
 *         type: string
 *       description:
 *         type: string
 *   Car:
 *     allOf:
 *       - $ref: '#/definitions/NewCar'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */

// GET cars/
/**
 * @swagger
 * /cars:
 *   get:
 *     tags:
 *       - Cars
 *     description: Returns cars
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: cars
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Car'
 */
carsRouter.get("/", auth, async (req: Request, res: Response) => {
    try {
        const cars: Car[] = await Car.findAll();
        res.status(200).send(cars);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// GET cars/:id
/**
 * @swagger
 *
 * /cars/{id}:
 *   get:
 *     tags:
 *       - Cars
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Car
 *         schema:
 *           type: Car
 *           item:
 *             $ref: '#/definitions/Car'
 */
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

/**
 * @swagger
 *
 * /cars:
 *   post:
 *     tags:
 *       - Cars
 *     description: Creates a car
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: car
 *         description: Car object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewCar'
 *     responses:
 *       200:
 *         description: cars
 *         schema:
 *           $ref: '#/definitions/Car'
 */
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
/**
 * @swagger
 *
 * /cars:
 *   put:
 *     description: Update a existing car
 *     tags:
 *       - Cars
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: car
 *         description: Car object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewCar'
 *     responses:
 *       200:
 *         description: Cars
 *         schema:
 *           $ref: '#/definitions/Cars'
 */
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
/**
 * @swagger
 *
 * /cars/{id}:
 *   delete:
 *     tags:
 *       - Cars
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Success
 */
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