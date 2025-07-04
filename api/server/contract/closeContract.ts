"use server";

import { db } from "@/config/prisma";

export async function closeContract(employeeId: string, contractId: string) {
  return db.contract.update({
    where: {
      id: contractId,
      employee_id: employeeId,
    },
    data: {
      end_date: new Date(),
      status: "not_active",
    },
  });
}
