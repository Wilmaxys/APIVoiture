/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { itemsRouter } from "./models/items/items.router";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { db as mysql } from "./config/mysql.config"
import { databaseInitialization } from "./models/db.init";
import { usersRouter } from "./models/users/users.router";
dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 * Swagger documentation
 */

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Beautiful Car API",
            version: "0.1.0",
            description:
                "This is a car API application made with love by Benjamin & Simon",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Benjamin & Simon",
                url: "https://benjaminetsimon.com",
                email: "benjamin@simon.com",
            },
        },
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: "header"
              }
            }
          },
          security:{
            bearerAuth: [] ,
          },
        servers: [
            {
                url: "http://localhost:"+PORT+"/",
            },
        ],
    },
    apis: ['./src/**/*.router.ts'],
};

const specs = swaggerJsdoc(options);

/**
 *  App Configuration
 */

app.use(helmet());
app.use((req, res, next) => { next(); }, cors());
app.use(express.json());
app.use("/users", usersRouter);
app.use("/items", itemsRouter);
app.use(
    "/api/",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

/**
 * Database initialization
 */

databaseInitialization();
if(process.env.ENVIRONMENT == "dev"){
    mysql.instance.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
}
else {
    mysql.instance.sync();
}

/**
 * Server Activation
 */

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

/**
 * Webpack HMR Activation
 */

type ModuleId = string | number;

interface WebpackHotModule {
    hot?: {
        data: any;
        accept(
            dependencies: string[],
            callback?: (updatedDependencies: ModuleId[]) => void,
        ): void;
        accept(dependency: string, callback?: () => void): void;
        accept(errHandler?: (err: Error) => void): void;
        dispose(callback: (data: any) => void): void;
    };
}

declare const module: WebpackHotModule;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
}

