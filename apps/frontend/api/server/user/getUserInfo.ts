"use server";
import { db } from "@/config/prisma";

export async function getUserInfo(email?: string) {
  return db.user.findFirst({
    where: {
      email,
    },
  });
}
