"use server";

import { db } from "@/config/prisma";
import type { contract } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function createEmployeeContract(
  employeeId: string,
  data: Pick<contract, "ral" | "contract_type" | "working_hours" | "remote_policy" | "notes">
) {
  const { ral, contract_type, working_hours, remote_policy, notes } = data;
  const currentUser = await getUserInfoFromCookie();

  return db.contract.create({
    data: {
      employee_id: employeeId,
      ral,
      contract_type,
      working_hours,
      remote_policy,
      notes,
      start_date: new Date(),
      last_modified: new Date(),
      modified_by: currentUser.id,
      status: "active",
    },
  });
}
