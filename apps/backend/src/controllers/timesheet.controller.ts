import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  extractInfoFromToken,
  getUserIdFromEmail,
} from "../middleware/extractInfoFromToken";
import {
  createTimesheet,
  getTimesheetByUserId,
} from "../repository/timesheet.repository";

export const createTimesheetController = (app: Express) => {
  app.get(
    "/timesheet",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const user = await extractInfoFromToken(req);
        if (!user || !user.id) return res.status(403).send("Unauthorized");
        const userFromEmail = await getUserIdFromEmail(user.email);
        if (!userFromEmail || !userFromEmail.id) {
          return res.status(404).send("User not found");
        }

        const userTimesheet = await getTimesheetByUserId(userFromEmail.id);

        if (!userTimesheet) return res.status(404).send("User not found");

        return res.status(200).send(userTimesheet);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );

  app.post(
    "/timesheet",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const user = await extractInfoFromToken(req);
        if (!user || !user.id) return res.status(403).send("Unauthorized");
        const userFromEmail = await getUserIdFromEmail(user.email);
        if (!userFromEmail || !userFromEmail.id) {
          return res.status(404).send("User not found");
        }

        const timesheet = req.body;

        if (!timesheet)
          return res.status(400).send("Timesheet data is required");
        if (timesheet.user_id !== userFromEmail.id)
          return res.status(403).send("Unauthorized to create this timesheet");

        // TODO: Add validation for timesheet data

        const addedTimesheet = await createTimesheet(timesheet);

        return res.status(200).send(addedTimesheet);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );
};
