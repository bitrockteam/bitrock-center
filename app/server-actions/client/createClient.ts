"use server";

import { db } from "@/config/prisma";
import { client } from "@/db";

export async function createClient(
  data: Omit<client, "id" | "created_at" | "updated_at">,
) {
  return db.client.create({
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
