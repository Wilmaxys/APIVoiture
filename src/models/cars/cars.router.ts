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
 *       - dailyPrice
 *     properties:
 *       name:
 *         type: string
 *       immat:
 *         type: string
 *       brand:
 *         type: string
 *       description:
 *         type: string
 *       dailyPrice:
 *         type: number
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
 *     security:
 *       - bearerAuth: []
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
        let carReturn = [];

        carReturn = cars.map((element) => {
            return {
                id: element.id,
                name: element.name,
                description: element.description,
                brand: element.brand,
                immat: element.immat,
                dailyPrice: element.dailyPrice,
            }
        })

        res.status(200).send(carReturn);
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
 *     security:
 *       - bearerAuth: []
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
    try {
        const id: number = parseInt(req.params.id, 10);

        const car : Car | null = await Car.findOne({
            where: {
              id: id
            }
        });

        res.status(200).send({
            id: car?.id,
            name: car?.name,
            description: car?.description,
            brand: car?.brand,
            immat: car?.immat,
            dailyPrice: car?.dailyPrice,
        });
    } catch (e) {
        res.sendStatus(500);
    }
});

/**
 * @swagger
 *
 * /cars:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cars
 *     description: Creates a car
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/NewCar'
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
 * /cars/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update a existing car
 *     tags:
 *       - Cars
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/NewCar'
 *     responses:
 *       200:
 *         description: Cars
 *         schema:
 *           $ref: '#/definitions/Car'
 */
carsRouter.put("/:id", auth, async (req: Request, res: Response) => {
    try {
        const id : number = parseInt(req.params.id, 10);
        const car : Car = req.body;

        await Car.update(car, {
            where: {
              id: id
            }
          });

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

// DELETE cars/:id
/**
 * @swagger
 *
 * /cars/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
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
        res.sendStatus(500);
    }
});