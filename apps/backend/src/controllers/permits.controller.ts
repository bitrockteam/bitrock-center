import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createPermit,
  deletePermit,
  getPermitsByUser,
  getPermitsByReviewer,
  getPermitById,
  updatePermit,
  updatePermitStatus, // New method
} from "../repository/permits.repository";

export const createPermitsController = (app: Express) => {
  app.get(
    "/permits/user/:userId",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const permits = await getPermitsByUser(userId);

        if (!permits) return res.status(404).send("No permits found");

        return res.status(200).send(permits);
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
      }
    },
  );

  app.get(
    "/permits/reviewer/:reviewerId",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const permits = await getPermitsByReviewer(req.params.reviewerId);

        if (!permits.length) {
          return res.status(404).send("No permits found for this reviewer");
        }

        return res.status(200).json(permits);
      } catch (error) {
        console.error("Error fetching permits by reviewer:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  app.get(
    "/permits/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const permitId = req.params.id;
        const permit = await getPermitById(permitId);

        if (!permit) return res.status(404).send("Permit not found");

        return res.status(200).send(permit);
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
      }
    },
  );

  app.post(
    "/permits",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const newPermit = await createPermit(req.body);

        return res.status(200).send({ permit: newPermit });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );

  app.put(
    "/permits/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const updatedPermit = await updatePermit({
          ...req.body,
          id: req.params.id,
        });

        if (!updatedPermit) {
          return res.status(404).json({ error: "Permit not found" });
        }

        return res.status(200).json({ permit: updatedPermit });
      } catch (error) {
        console.error("Error updating permit:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  app.delete(
    "/permits/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const deleted = await deletePermit(req.params.id);

        if (!deleted) {
          return res.status(404).json({ error: "Permit not found" });
        }

        return res.status(200).json({ message: "Permit deleted successfully" });
      } catch (error) {
        console.error("Error deleting permit:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  // New route to approve the permit (change status)
  app.post(
    "/permits/:id/change-status",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const success = await updatePermitStatus(req.params.id, "approved");

        if (!success) {
          return res.status(404).json({ error: "Permit not found" });
        }

        return res
          .status(200)
          .json({ message: "Permit approved successfully" });
      } catch (error) {
        console.error("Error approving permit:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    },
  );
};
