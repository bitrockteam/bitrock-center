import { Role } from "@bitrock/db";
import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { updateRoleForUser } from "../repository/roles.repository";

export const createRolesController = (app: Express) => {
  app.put(
    "/role/:user_id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = req.params.user_id;
        const { roleId } = req.body;

        if (!userId) return res.status(400).send("User ID is required");

        const user = await updateRoleForUser(userId, roleId as Role);

        return res.status(200).send(user);
      } catch (error) {
        console.error(error);
        return res.status(500);
      }
    },
  );
};
