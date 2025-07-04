"use server";

import { db } from "@/config/prisma";

export async function getContractByEmployeeId(employeeId: string) {
  return db.contract.findFirst({
    where: {
      employee_id: employeeId,
    },
  });
}
