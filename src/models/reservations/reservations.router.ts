/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import { Reservation } from "./reservation.class";
import moment from 'moment';

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

// GET reservations/
reservationsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const reservations: Reservation[] = await Reservation.findAll();
        res.status(200).send(reservations);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// GET reservations/:id
reservationsRouter.get("/:id", async (req: Request, res: Response) => {
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


// POST reservations/
reservationsRouter.post("/", async (req: Request, res: Response) => {
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

// PUT reservations/
reservationsRouter.put("/", async (req: Request, res: Response) => {
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

// DELETE reservations/:id
reservationsRouter.delete("/:id", async (req: Request, res: Response) => {
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