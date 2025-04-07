import { type Express, type Request, type Response } from "express";

import { version } from "../package.json";
import { createUserController } from "./controllers/user.controller";
import { createRolesController } from "./controllers/roles.controller";

const isLocal = process.env.MODE === "local";

export const addPublicRoutes = (app: Express) => {
  app.get("/", (_: Request, res: Response) => {
    res.send({ message: "Bitrock Town Server", local: isLocal, version });
  });

  createUserController(app);
  createRolesController(app);
};
