"use server";
import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { contract } from "../../../db";

export async function updateEmployeeContract(
  employeeId: string,
  contract: Pick<
    contract,
    "id" | "ral" | "contract_type" | "working_hours" | "remote_policy" | "notes"
  >,
) {
  const currentUser = await getUserInfoFromCookie();

  return db.contract.update({
    where: {
      id: contract.id,
      employee_id: employeeId,
    },
    data: {
      ral: contract.ral,
      contract_type: contract.contract_type,
      end_date: new Date(),
      modified_by: currentUser.id,
      last_modified: new Date(),
    },
  });
}
