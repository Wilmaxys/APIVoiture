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
 *       - $ref: '#/definitions/NewItem'
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
 *     description: Returns reservations
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: reservations
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Reservation'
 *     tags:
 *       - Reservation
 */
reservationsRouter.get("/", auth, async (req: Request, res: Response) => {
    try {
        const reservations: Reservation[] = await Reservation.findAll();
        res.status(200).send(reservations);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * @swagger
 *
 * /reservations/{id}:
 *   get:
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
 *           item:
 *             $ref: '#/definitions/Reservation'
 *     tags:
 *       - Reservation
 */
reservationsRouter.get("/:id", auth, async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const reservation : Reservation | null = await Reservation.findOne({
            where: {
              id: id
            }
        });

        res.status(200).send(reservation);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


/**
 * @swagger
 *
 * /reservations:
 *   post:
 *     description: Creates a reservation
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: reservation
 *         description: Reservation object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewReservation'
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
 * /reservations:
 *   put:
 *     description: Update an existing reservation
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: reservation
 *         description: Reservation object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewReservation'
 *     responses:
 *       200:
 *         description: reservations
 *         schema:
 *           $ref: '#/definitions/Reservation'
 *     tags:
 *       - Reservation
 */
reservationsRouter.put("/", auth, async (req: Request, res: Response) => {
    try {
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
        res.status(500).send(e.message);
    }
});

/**
 * @swagger
 *
 * /reservations/{id}:
 *   delete:
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
        res.status(500).send(e.message);
    }
});