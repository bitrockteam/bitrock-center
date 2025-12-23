"use server";

import { db } from "@/config/prisma";
import type { client } from "@/db";

export async function updateClient(
  id: string,
  data: Omit<client, "id" | "created_at" | "updated_at">
) {
  return db.client.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code,
      email: data.email,
      phone: data.phone,
      address: data.address,
      vat_number: data.vat_number,
      contact_person: data.contact_person,
      status: data.status,
      notes: data.notes,
    },
  });
}
