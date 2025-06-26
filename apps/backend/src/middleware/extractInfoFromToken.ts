import { Request } from "express";
import { db } from "../config/prisma";
import { supabase } from "../config/supabase";

// Middleware for protected routes
export const extractInfoFromToken = (req: Request) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken) return null;
  try {
    const tokenString = bearerToken.split("Bearer ")[1];
    if (!tokenString) return null;
    return supabase.auth.getUser(tokenString).then((response) => {
      if (response.data.user) return response.data.user;
      return null;
    });
  } catch (err) {
    return null;
  }
};

export const getUserIdFromEmail = async (email?: string) => {
  if (!email) return null;
  return db.user.findFirst({
    where: { email },
  });
};
