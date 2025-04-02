import 'reflect-metadata';
import * as fs from "fs";
import * as path from "path";
import { useContainer } from "class-validator";
import cors from "cors";
import {
    Response,
    Request,
    NextFunction,
} from "express";
import { ValidateError } from "tsoa";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger.json"; // Swagger config
import { iocContainer } from "./dependency.injection";
import { instanceOfIHttpActionResult, InversifyExpressServer } from "inversify-express-utils";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { RegisterRoutes } from './config/routes';
import { ErrorResponse, UnauthResponse } from './business_objects/error.response';

dotenv.config(); // Loads .env from the root
// Import Controllers and create Server
const controllersPath = path.join(__dirname, "controllers");
fs.readdirSync(controllersPath).forEach((file) => {
    require(path.join(controllersPath, file));
});
const server = new InversifyExpressServer(iocContainer);
useContainer(iocContainer);

// Middleware
server.setConfig((app) => {
    app.use(cors()) //CORS
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        console.log(`${JSON.stringify(req.body)}`);
        next();
    });
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //Swagger testing
    RegisterRoutes(app);
    app.use(function notFoundHandler(_req, res: Response) {
        res.status(404).send({
            message: "Not Found",
        });
    });
    app.use(function errorHandler(
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(422).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal Server Error",
                details: err.message,
            });
        }
        if (err instanceof ErrorResponse) {
            return res.status(400).json({
                message: err.message,
            });
        }
        if (err instanceof UnauthResponse) {
            return res.status(401).json({
                message: err.message,
            });
        }
        next(err);
    });
})

// Build and start the app
const app = server.build();
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});