import { type Express, type Request, type Response } from "express";

import { version } from "../package.json";
import { createUserController } from "./controllers/user.controller";
import { createRolesController } from "./controllers/roles.controller";
import { createProjectsController } from "./controllers/projects.controller";
import { createStatusesController } from "./controllers/statuses.controller";
import { createAllocationsController } from "./controllers/allocations.controller";

const isLocal = process.env.MODE === "local";

export const addPublicRoutes = (app: Express) => {
  app.get("/", (_: Request, res: Response) => {
    res.send({ message: "Bitrock Town Server", local: isLocal, version });
  });

  createUserController(app);
  createRolesController(app);
  createProjectsController(app);
  createStatusesController(app);
  createAllocationsController(app);
};
