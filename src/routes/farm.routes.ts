import { RequestHandler, Router } from "express";
import { isAuthorized } from "middlewares/auth.middleware";
import { FarmsController } from "modules/farms/farms.controller";

const router = Router();
const farmsController = new FarmsController();

router.post("/", isAuthorized, farmsController.create.bind(farmsController) as RequestHandler);
router.get("/", isAuthorized, farmsController.getAll.bind(farmsController) as RequestHandler);
router.delete("/:id", isAuthorized, farmsController.delete.bind(farmsController) as RequestHandler);

export default router;
