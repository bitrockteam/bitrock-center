"use server";

import { db } from "@/config/prisma";

export async function findClientById(id: string) {
  return db.client.findUnique({
    where: {
      id,
    },
    include: {
      work_items: true,
      project: {
        include: {
          allocation: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
}

export type FindClientByIdResponse = Awaited<ReturnType<typeof findClientById>>;
