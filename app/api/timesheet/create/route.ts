import { addTimesheet } from "@/app/server-actions/timesheet/addTimesheet";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createTimesheetSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  project_id: z.string().uuid(),
  hours: z.number().min(0.5).max(24),
  description: z.string().optional(),
  user_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const userInfo = await getUserInfoFromCookie();
    if (!userInfo) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = createTimesheetSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: validatedData.error },
        { status: 400 },
      );
    }

    const timesheet = await addTimesheet({
      timesheet: {
        ...validatedData.data,
        description: validatedData.data.description || null,
      },
    });

    return NextResponse.json({ success: true, data: timesheet });
  } catch (error) {
    console.error("Error creating timesheet:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create timesheet" },
      { status: 500 },
    );
  }
}
