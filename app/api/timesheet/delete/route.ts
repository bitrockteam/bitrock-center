import { deleteTimesheet } from "@/app/server-actions/timesheet/deleteTimesheet";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const deleteTimesheetSchema = z.object({
  id: z.string().uuid(),
});

export async function DELETE(request: NextRequest) {
  try {
    const userInfo = await getUserInfoFromCookie();
    if (!userInfo) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = deleteTimesheetSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: validatedData.error },
        { status: 400 },
      );
    }

    await deleteTimesheet(validatedData.data.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting timesheet:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete timesheet" },
      { status: 500 },
    );
  }
}
