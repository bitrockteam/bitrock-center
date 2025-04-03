import { NextFunction, type Request, type Response } from "express";
import { supabase } from "../config/supabase";

// Middleware for protected routes
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken) return res.status(403).send("Unauthorized");
  try {
    const tokenString = bearerToken.split("Bearer ")[1];
    if (!tokenString) return res.status(403).send("Unauthorized");
    supabase.auth.getUser(tokenString).then((response) => {
      if (response.data.user) next();
      else res.status(403).send("Unauthorized");
    });
  } catch (err) {
    res.status(403).send("Unauthorized");
  }
};
