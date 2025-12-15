"use server";
import { db } from "@/config/prisma";

export async function getAllClients() {
  return db.client.findMany({
    include: {
      work_items: {
        include: {
          allocation: {
            include: {
              user: true,
            },
          },
        },
      },
      project: true,
    },
  });
}

export type GetAllClientsResponse = Awaited<ReturnType<typeof getAllClients>>[number];
