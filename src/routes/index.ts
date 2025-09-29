import { Router } from "express";
import tarefasRouter from "./tarefas/index.route.js";

const routes = Router();

routes.use('/tarefas', tarefasRouter);

export default routes;
