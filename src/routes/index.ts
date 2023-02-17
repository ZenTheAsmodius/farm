import { Router } from "express";
import auth from "./auth.routes";
import user, { routerV2 as userV2 } from "./user.routes";
import farm from "./farm.routes";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/v2/users", userV2)
routes.use("/v1/farms", farm)

export default routes;
