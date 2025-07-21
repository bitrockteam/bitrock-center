import { fetchUserTimesheet } from "@/app/server-actions/timesheet/fetchUserTimesheet";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userInfo = await getUserInfoFromCookie();
    if (!userInfo) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const timesheets = await fetchUserTimesheet();

    return NextResponse.json({ success: true, data: timesheets });
  } catch (error) {
    console.error("Error fetching timesheet:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timesheet" },
      { status: 500 },
    );
  }
}
