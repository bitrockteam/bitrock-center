"use server";
import { db } from "@/config/prisma";

export const deleteTimesheet = async (id: string) => {
  return db.timesheet.delete({
    where: { id },
  });
};
