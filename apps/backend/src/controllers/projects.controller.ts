import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getProjects } from "../repository/projects.repository";

export const createProjectsController = (app: Express) => {
  app.get(
    "/projects",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const projects = await getProjects();

        if (!projects) return res.status(404).send("projects not found");

        return res.status(200).send(projects);
      } catch (error) {
        console.error(error);
        return res.status(500);
      }
    },
  );
};
