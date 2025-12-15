import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { fetchUserTimesheet } from "@/app/server-actions/timesheet/fetchUserTimesheet";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function GET() {
  try {
    const userInfo = await getUserInfoFromCookie();
    if (!userInfo) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const timesheets = await fetchUserTimesheet();

    return NextResponse.json({ success: true, data: timesheets });
  } catch (error) {
    logErrorSummary("fetch-timesheet", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
