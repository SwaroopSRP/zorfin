import { Router } from "express";
import { healthCheck } from "./healthcheck.controller.ts";

const healthCheckRouter = Router();

healthCheckRouter.get("/", healthCheck);

export default healthCheckRouter;
