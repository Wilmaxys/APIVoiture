/**
 * Required External Modules and Interfaces
 */
var jwt = require('jsonwebtoken');

import express, { Request, Response } from "express";

/**
 * Router Definition
 */

export const usersRouter = express.Router();
/**
 * @swagger
 * /users/login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     tags:
 *       - Users
 *     parameters:
 *       - name: user
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
usersRouter.post('/login', function(req, res) {
    if(req.body.user === "admin" && req.body.password === "admin"){
        var token = jwt.sign({ id: 1 }, "RANDOM_TOKEN_SECRET", {
            expiresIn: 86400
          });
          
          res.status(200).send({ auth: true, token: token });
    }else{
        res.status(404).send({ auth: false, token:null});

    }

});