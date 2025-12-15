import { updateTimesheet } from "@/app/server-actions/timesheet/updateTimesheet";
import { logErrorSummary } from "@/lib/utils";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTimesheetSchema = z.object({
  id: z.string().uuid(),
  date: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  project_id: z.string().uuid().optional(),
  hours: z.number().min(0.5).max(24).optional(),
  description: z.string().optional().nullable(),
  user_id: z.string().uuid().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const userInfo = await getUserInfoFromCookie();
    if (!userInfo) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateTimesheetSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: validatedData.error },
        { status: 400 }
      );
    }

    const { id, ...updateData } = validatedData.data;

    const timesheet = await updateTimesheet({
      id,
      timesheet: {
        ...updateData,
        description: updateData.description ?? null,
      },
    });

    return NextResponse.json({ success: true, data: timesheet });
  } catch (error) {
    logErrorSummary("Error updating timesheet", error);
    return NextResponse.json(
      { success: false, error: "Failed to update timesheet" },
      { status: 500 }
    );
  }
}
