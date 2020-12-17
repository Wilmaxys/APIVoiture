/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { carsRouter } from "./models/cars/cars.router";
import { reservationsRouter } from "./models/reservations/reservations.router";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { db as mysql } from "./config/mysql.config"
import { databaseTableInitialization, databaseForeignJeyInitialization, databseDataInitialization } from "./models/db.init";
import { usersRouter } from "./models/users/users.router";

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

declare const module : WebpackHotModule;

(async () => {
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
        swaggerOptions: {
            authAction : { JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} }
        },
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Beautiful Car API",
                version: "1.0.2",
                description:
                    "This is a beautiful car API made with love by Benjamin & Simon"
            },
            components: {
                securitySchemes: {
                  bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                  }
                }
              },
            security:{
                bearerAuth: [] ,
            },
            servers: [
                {
                    url: "https://mysterious-eyrie-25660.herokuapp.com",
                },
            ],
        },
        apis: ["./**/**/*.router.ts"],
    };

    const specs = swaggerJsdoc(options);

    /**
     *  App Configuration
     */
    app.use(helmet());
    app.use((req, res, next) => { next(); }, cors());
    app.use(express.json());
    app.use("/cars", carsRouter);
    app.use("/users", usersRouter);
    app.use("/reservations", reservationsRouter);
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs)
    );

    /**
     * Database initialization
     */
    databaseTableInitialization();
    databaseForeignJeyInitialization();
    if (process.env.ENVIRONMENT == "dev") {
        await mysql.instance.sync({ force: true });
    }
    else {
        mysql.instance.sync();
    }
    databseDataInitialization();

    /**
     * Server Activation
     */
    const server = app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => server.close());
    }
})();
