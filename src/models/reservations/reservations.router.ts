/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import { Reservation } from "./reservation.class";
import moment from 'moment';
import auth from '../../middleware/Auth';

const isInConflict = async (reservation : Reservation) => {
    let isInConflict = false;

    const reservations : Reservation[] = await Reservation.findAll(
        {
            where : {
                carId : reservation.carId
            }
        }
    )

    reservations.forEach(element => {
        if((reservation.begin >= element.begin && reservation.begin <= element.end)
        || (reservation.end <= element.end && reservation.end >= element.begin)
        || (element.begin >= reservation.begin && element.end <= reservation.end)) {
            isInConflict = true;
        }
    });

    return isInConflict;
} 

/**
 * Router Definition
 */

export const reservationsRouter = express.Router();

/**
 * Controller Definitions
 */

/**
 * @swagger
 *
 * definitions:
 *   NewReservation:
 *     type: object
 *     required:
 *       - carId
 *       - begin
 *       - end
 *     properties:
 *       carId:
 *         type: number
 *       begin:
 *         type: date
 *       end:
 *         type: date
 *   Reservation:
 *     allOf:
 *       - $ref: '#/definitions/NewReservation'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Returns reservations
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: reservations
 *         schema:
 *           type: array
 *           reservations:
 *             $ref: '#/definitions/Reservation'
 *     tags:
 *       - Reservation
 */
reservationsRouter.get("/", auth, async (req: Request, res: Response) => {
    try {
        const reservations: Reservation[] = await Reservation.findAll();
        let reservationsReturns = [];

        reservationsReturns = reservations.map((element : Reservation) => {
            let elementReturned = {
                id : element.id,
                carId : element.carId,
                begin : element.begin.getUTCDate() + "/" + (element.begin.getUTCMonth() + 1) + "/" + element.begin.getUTCFullYear(),
                end : element.end.getUTCDate() + "/" + (element.begin.getUTCMonth() + 1) + "/" + element.end.getUTCFullYear()
            };

            return elementReturned;
        });

        res.status(200).send(reservationsReturns);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * @swagger
 *
 * /reservations/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: reservation
 *         schema:
 *           type: reservation
 *           reservation:
 *             $ref: '#/definitions/Reservation'
 *     tags:
 *       - Reservation
 */
reservationsRouter.get("/:id", auth, async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);

        const reservation : Reservation | null = await Reservation.findOne({
            where: {
              id: id
            }
        });

        if (reservation !== null && reservation !== undefined)
        {
            const resReturn = {
                id : reservation?.id,
                carId: reservation?.carId,
                begin: reservation?.begin.getUTCDate() + "/" + (reservation?.begin.getUTCMonth() + 1) + "/" + reservation?.begin.getUTCFullYear(),
                end: reservation?.end.getUTCDate() + "/" + (reservation?.end.getUTCMonth() + 1)  + "/" + reservation?.end.getUTCFullYear()
            }
            res.status(200).send(resReturn);
        }
        else{
            res.status(404).send();
        }
    } catch (e) {
        res.sendStatus(500);
    }
});


/**
 * @swagger
 *
 * /reservations:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Creates a reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/NewReservation'
 *     responses:
 *       200:
 *         description: reservations
 *         schema:
 *           $ref: '#/definitions/Reservation'
 *     tags:
 *       - Reservation
 */
reservationsRouter.post("/", auth, async (req: Request, res: Response) => {
    try {
        const reservation : Reservation = req.body;

        reservation.begin = moment.utc(reservation.begin, "DD/MM/YYYY", "Europe/Paris").toDate()
        reservation.end = moment.utc(reservation.end, "DD/MM/YYYY", "Europe/Paris").toDate()

        if (!(await isInConflict(reservation))) {
            await Reservation.create(reservation);
        }
        else
            throw new Error('Car is already reserved for this time.');


        res.sendStatus(201);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * @swagger
 *
 * /reservations/disponibility:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Test if you can create a reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/NewReservation'
 *     responses:
 *       200:
 *         description: reservations
 *         schema:
 *           $ref: '#/definitions/Reservation'
 *     tags:
 *       - Reservation
 */
reservationsRouter.post("/disponibility", auth, async (req: Request, res: Response) => {
    try {
        const reservation : Reservation = req.body;
        reservation.begin = moment.utc(reservation.begin, "DD/MM/YYYY", "Europe/Paris").toDate()
        reservation.end = moment.utc(reservation.end, "DD/MM/YYYY", "Europe/Paris").toDate()

        let disponibility = !(await isInConflict(reservation));
    
        res.send({disponibility : disponibility});
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * @swagger
 *
 * /reservations/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     description: Update an existing reservation
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
 *             $ref: '#/definitions/NewReservation'
 *     responses:
 *       200:
 *         description: reservations
 *         schema:
 *           $ref: '#/definitions/Reservation'
 *     tags:
 *       - Reservation
 */
reservationsRouter.put("/:id", auth, async (req: Request, res: Response) => {
    try {
        const id : number = parseInt(req.params.id, 10);
        const reservation: Reservation = req.body;

        reservation.begin = moment.utc(reservation.begin, "DD/MM/YYYY", "Europe/Paris").toDate()
        reservation.end = moment.utc(reservation.end, "DD/MM/YYYY", "Europe/Paris").toDate()

        if (!(await isInConflict(reservation))) {
            await Reservation.update(reservation, {
            where: {
              id: reservation.id
            }
          });
        }
        else
            throw new Error('Car is already reserved for this time.');

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

/**
 * @swagger
 *
 * /reservations/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
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
 *     tags:
 *       - Reservation
 */
reservationsRouter.delete("/:id", auth, async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        
        await Reservation.destroy({
            where: {
              id: id
            }
        });

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});