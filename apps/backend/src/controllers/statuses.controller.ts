import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getStatuses } from "../repository/statuses.repository";

export const createStatusesController = (app: Express) => {
  app.get(
    "/statuses",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const statuses = await getStatuses();

        if (!statuses) return res.status(404).send("statuses not found");

        return res.status(200).send(statuses);
      } catch (error) {
        console.error(error);
        return res.status(500);
      }
    },
  );
};
