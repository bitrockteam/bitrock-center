"use server";

import { db } from "@/config/prisma";
import { client } from "../../../db";

export async function updateClient(
  id: string,
  data: Omit<client, "id" | "created_at" | "updated_at">,
) {
  return db.client.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code,
    },
  });
}
