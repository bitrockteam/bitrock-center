import { type Express, type Request, type Response } from "express";

import { version } from "../package.json";
import { createAiController } from "./controllers/ai.controller";
import { createAllocationsController } from "./controllers/allocations.controller";
import { createPermitsController } from "./controllers/permits.controller";
import { createProjectsController } from "./controllers/projects.controller";
import { createRolesController } from "./controllers/roles.controller";
import { createStatusesController } from "./controllers/statuses.controller";
import { createTimesheetController } from "./controllers/timesheet.controller";
import { createUserController } from "./controllers/user.controller";

const isLocal = process.env.MODE === "local";

export const addPublicRoutes = (app: Express) => {
  app.get("/", (_: Request, res: Response) => {
    res.send({ message: "Bitrock Town Server", local: isLocal, version });
  });

  createUserController(app);
  createRolesController(app);
  createProjectsController(app);
  createStatusesController(app);
  createPermitsController(app);
  createAllocationsController(app);
  createTimesheetController(app);
  createAiController(app);
};
