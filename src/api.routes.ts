import { Router } from "express";
import authRouter from "./modules/auth/auth.routes.ts";
import healthCheckRouter from "./modules/healthcheck/healthcheck.routes.ts";
import recordRouter from "./modules/records/records.routes.ts";
import summaryRouter from "./modules/summary/summary.routes.ts";
import userRouter from "./modules/user/user.routes.ts";

const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/health", healthCheckRouter);
apiRouter.use("/records", recordRouter);
apiRouter.use("/summary", summaryRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;
