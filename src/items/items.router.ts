/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as ItemService from "./items.service";
import { Item } from "./item.interface";
import { Items } from "./items.interface";

/**
 * Router Definition
 */

export const itemsRouter = express.Router();

/**
 * Controller Definitions
 */

 
// GET items/
/**
 * @swagger
 *
 * definitions:
 *   NewItem:
 *     type: object
 *     required:
 *       - name
 *       - price
 *     properties:
 *       name:
 *         type: string
 *       price:
 *         type: number
 *   Item:
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
 * /items:
 *   get:
 *     description: Returns items
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: items
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Item'
 */
itemsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const items: Items = await ItemService.findAll();

        res.status(200).send(items);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// GET items/:id
/**
 * @swagger
 *
 * /items/{id}:
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
 *         description: item
 *         schema:
 *           type: item
 *           item:
 *             $ref: '#/definitions/Item'
 */
itemsRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const item: Item = await ItemService.find(id);

        res.status(200).send(item);
    } catch (e) {
        res.status(404).send(e.message);
    }
});


// POST items/
/**
 * @swagger
 *
 * /items:
 *   post:
 *     description: Creates a item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: item
 *         description: Item object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewItem'
 *     responses:
 *       200:
 *         description: items
 *         schema:
 *           $ref: '#/definitions/Item'
 */
itemsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const item: Item = req.body.item;

        await ItemService.create(item);

        res.sendStatus(201);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

// PUT items/
/**
 * @swagger
 *
 * /item:
 *   put:
 *     description: Update a existing item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: item
 *         description: Item object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewItem'
 *     responses:
 *       200:
 *         description: items
 *         schema:
 *           $ref: '#/definitions/Item'
 */
itemsRouter.put("/", async (req: Request, res: Response) => {
    try {
        const item: Item = req.body.item;

        await ItemService.update(item);

        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// DELETE items/:id
/**
 * @swagger
 *
 * /items/{id}:
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
 */
itemsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        await ItemService.remove(id);

        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e.message);
    }
});