import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createProject,
  deleteProject,
  getAvailableUsersForProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../repository/projects.repository";

export const createProjectsController = (app: Express) => {
  app.get(
    "/projects",
    authenticateToken,
    async (req: Request, res: Response) => {
      const { params } = req.query;
      try {
        const projects = await getProjects(params as string);

        if (!projects) return res.status(404).send("projects not found");

        return res.status(200).send(projects);
      } catch (error) {
        console.error(error);
        return res.status(500);
      }
    },
  );

  app.get(
    "/projects/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const projectId = req.params.id;
        const projects = await getProjectById(projectId);

        if (!projects) return res.status(404).send("projects not found");

        return res.status(200).send(projects);
      } catch (error) {
        console.error(error);
        return res.status(500);
      }
    },
  );

  app.post(
    "/projects",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const newUser = await createProject(req.body);

        return res.status(200).send({ user: newUser });
      } catch (error) {
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );

  app.put("/projects/:id", authenticateToken, async (req, res) => {
    try {
      const updatedProject = await updateProject({
        ...req.body,
        id: req.params.id,
      });

      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }

      return res.status(200).json({ project: updatedProject });
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/projects/:id", authenticateToken, async (req, res) => {
    try {
      const deleted = await deleteProject(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }

      return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get(
    "/projects/:id/users/available",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const projectId = req.params.id;

        if (!projectId) res.status(400).send("Project ID not provided");

        const users = await getAvailableUsersForProject(projectId);

        return res.status(200).send(users);
      } catch (error) {
        console.error(error);
        return res.status(500);
      }
    },
  );
};
