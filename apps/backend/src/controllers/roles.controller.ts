import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getRoles } from "../repository/roles.repository";

export const createRolesController = (app: Express) => {
  app.get("/roles", authenticateToken, async (req: Request, res: Response) => {
    try {
      const roles = await getRoles();

      if (!roles) return res.status(404).send("Roles not found");

      return res.status(200).send(roles);
    } catch (error) {
      console.error(error);
      return res.status(500);
    }
  });
};
