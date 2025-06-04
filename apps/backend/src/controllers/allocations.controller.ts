import { ICreateAllocation, IUpdateAllocation } from "@bitrock/types";
import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createAllocation,
  deleteAllocationForUser,
  getAllocationsForProject,
  updateAllocationForUser,
} from "../repository/allocations.repository";

export const createAllocationsController = (app: Express) => {
  /**
   * @swagger
   *
   * /user:
   *   post:
   *     summary: Create a new user manually
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User created successfully
   *       400:
   *         description: User not provided
   *       403:
   *         description: Unauthorized
   *       409:
   *         description: User already exists
   *       500:
   *         description: Error performing the request
   */
  app.post(
    "/allocation",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const allocationRequest = req.body as ICreateAllocation;
        if (!allocationRequest.user_id)
          return res.status(400).send("User not provided");
        if (!allocationRequest.project_id)
          return res.status(400).send("Project not provided");

        if (
          allocationRequest.start_date &&
          allocationRequest.end_date &&
          allocationRequest.start_date > allocationRequest.end_date
        ) {
          return res.status(400).send("Start date must be before end date");
        }

        const newAllocation = await createAllocation(allocationRequest);

        return res.status(200).send({ allocation: newAllocation });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );

  app.get(
    "/allocations/:project_id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const project_id = req.params.project_id;

        if (!project_id) return res.status(400).send("Project not provided");

        const allocations = await getAllocationsForProject(project_id);

        return res.status(200).send(allocations);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );

  app.patch(
    "/allocation/:project_id/:user_id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const project_id = req.params.project_id;
        const user_id = req.params.user_id;

        if (!project_id) return res.status(400).send("Project not provided");
        if (!user_id) return res.status(400).send("User not provided");

        const allocationRequest = req.body as IUpdateAllocation;

        const updatedAllocation = await updateAllocationForUser(
          project_id,
          user_id,
          allocationRequest,
        );

        return res.status(200).send({ allocation: updatedAllocation });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );

  app.delete(
    "/allocation/:project_id/:user_id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const project_id = req.params.project_id;
        const user_id = req.params.user_id;

        if (!project_id) return res.status(400).send("Project not provided");
        if (!user_id) return res.status(400).send("User not provided");

        await deleteAllocationForUser(project_id, user_id);

        return res.status(200).send({ message: "Allocation deleted" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );
};
