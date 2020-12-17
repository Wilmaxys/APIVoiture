/**
 * Required External Modules and Interfaces
 */
var jwt = require('jsonwebtoken');

import express, { Request, Response } from "express";

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - user
 *       - password
 *     properties:
 *       user:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * Router Definition
 */

export const usersRouter = express.Router();

/**
 * @swagger
 * paths:
 *   /users/login:
 *     post:
 *       summary: Login to the api
 *       tags:
 *         - User
 *       requestBody:
 *         description: The credentials are admin/admin
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       responses:
 *         '201':
 *           description: Created
 */
usersRouter.post('/login', function(req, res) {

    console.log('======================');
    console.log(req.body);
    console.log('======================');

    if(req.body.user === "admin" && req.body.password === "admin"){
        var token = jwt.sign({ id: 1 }, "RANDOM_TOKEN_SECRET", {
            expiresIn: 86400
          });
          
          res.status(200).send({ auth: true, token: token });
    }else{
        res.status(404).send({ auth: false, token:null});

    }

});