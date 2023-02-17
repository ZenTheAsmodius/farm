import { RequestHandler, Router } from "express";
import { UsersController } from "modules/users/users.controller";

const usersController = new UsersController();

const router = Router();
router.post("/", usersController.create.bind(usersController) as RequestHandler);

export const routerV2 = Router();
routerV2.post("/", usersController.createV2.bind(usersController) as RequestHandler);

export default router;
