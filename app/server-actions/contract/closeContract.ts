"use server";

import { db } from "@/config/prisma";
import { contractstatus } from "@/db";

export async function closeContract(employeeId: string, contractId: string) {
  return db.contract.update({
    where: {
      id: contractId,
      employee_id: employeeId,
    },
    data: {
      end_date: new Date(),
      status: contractstatus.not_active,
    },
  });
}
