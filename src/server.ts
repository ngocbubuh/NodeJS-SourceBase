import 'reflect-metadata';
import * as fs from "fs";
import * as path from "path";
import { useContainer, ValidationError } from "class-validator";
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
import { InversifyExpressServer } from "inversify-express-utils";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { RegisterRoutes } from './config/routes';
import {  ErrorResponseV2, RejectResponseV2, UnAuthResponseV2 } from './business_objects/error.response';
import { ErrorCode } from './utils/enums/enums';
import config from './utils/environments/environment';

dotenv.config(); // Loads .env from the root
// Import Controllers and create Server
const controllersPath = path.join(__dirname, "controllers");
fs.readdirSync(controllersPath).forEach((file) => {
    require(path.join(controllersPath, file));
});
const server = new InversifyExpressServer(iocContainer);

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
        if (Array.isArray(err) && err[0] instanceof ValidationError) {
            //console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            const error = new ErrorResponseV2(ErrorCode.VALIDATION_FAILED, err.map(e => ({
                property: e.property,
                constraints: e.constraints,
            })));
            return res.status(422).json(error.toJSON());
        }
        if (err instanceof ValidateError) {
            const error = new ErrorResponseV2(ErrorCode.VALIDATION_FAILED, {
                details: err?.fields,
            });
            return res.status(422).json(error);
        }
        if (err instanceof Error) {
            var error;
            if (config.env == 'development') {
                error = new ErrorResponseV2(ErrorCode.INTERNAL_ERROR, err.message)
            } else {
                error = new ErrorResponseV2(ErrorCode.INTERNAL_ERROR)
            }
            return res.status(500).json(error.toJSON());
        }
        if (err instanceof ErrorResponseV2) {
            return res.status(400).json(err.toJSON());
        }
        if (err instanceof UnAuthResponseV2) {
            return res.status(401).json(err.toJSON());
        }
        if (err instanceof RejectResponseV2) {
            return res.status(403).json(err.toJSON());
        } else {
            var error;
            if (config.env == 'development') {
                error = new ErrorResponseV2(ErrorCode.INTERNAL_ERROR, err)
            } else {
                error = new ErrorResponseV2(ErrorCode.INTERNAL_ERROR)
            }
            return res.status(500).json(error.toJSON());
        }
    });
})

// Build and start the app
const app = server.build();
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});