import { ICreateUser } from "@bitrock/types";
import { type Express, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { extractInfoFromToken } from "../middleware/extractInfoFromToken";
import {
  createUserFromAuth,
  createUserManually,
  getUserByAuthId,
  getUsers,
} from "../repository/user.repository";

export const createUserController = (app: Express) => {
  /**
   * @swagger
   *
   * /user:
   *   get:
   *     summary: Get user by auth ID
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *       403:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   *       500:
   *         description: Error performing the request
   * security:
   *  - BearerAuth: []
   * tags:
   *  - User
   * description: Get user by auth ID
   */
  app.get("/user", authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await extractInfoFromToken(req);
      if (!user) return res.status(403).send("Unauthorized");

      const userFromDb = await getUserByAuthId(user.id);
      if (!userFromDb) return res.status(404).send("User not found");
      if (userFromDb.auth_id !== user.id)
        return res.status(403).send("Unauthorized");

      return res.status(200).send(userFromDb);
    } catch (error) {
      return res.status(500).json({ error: "Error performing the request" });
    }
  });

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of users retrieved successfully
   *       500:
   *         description: Error performing the request
   */
  app.get("/users", authenticateToken, async (_req: Request, res: Response) => {
    try {
      const users = await getUsers();
      return res.status(200).send(users);
    } catch (error) {
      return res.status(500).json({ error: "Error performing the request" });
    }
  });

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
  app.post("/user", authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await extractInfoFromToken(req);
      if (!user) return res.status(403).send("Unauthorized");

      const userAlreadyExists = Boolean(await getUserByAuthId(user.id));
      if (userAlreadyExists) return res.status(409).send("User already exists");

      const userRequest = req.body as ICreateUser;
      if (!userRequest) return res.status(400).send("User not provided");

      const newUser = await createUserManually(userRequest);

      return res.status(200).send({ user: newUser });
    } catch (error) {
      return res.status(500).json({ error: "Error performing the request" });
    }
  });

  /**
   * @swagger
   * /user/provider:
   *   post:
   *     summary: Create a new user from provider
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/ICreateUser"
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
    "/user/provider",
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const user = await extractInfoFromToken(req);
        if (!user) return res.status(403).send("Unauthorized");

        const userAlreadyExists = Boolean(await getUserByAuthId(user.id));
        if (userAlreadyExists)
          return res.status(409).send("User already exists");

        const userRequest = req.body as ICreateUser;
        if (!userRequest) return res.status(400).send("User not provided");

        const newUser = await createUserFromAuth(user.id, userRequest);

        return res.status(200).send({ user: newUser });
      } catch (error) {
        return res.status(500).json({ error: "Error performing the request" });
      }
    },
  );
};
