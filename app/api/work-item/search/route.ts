import { type NextRequest, NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { fetchAllWorkItems } from "@/app/server-actions/work-item/fetchAllWorkItems";
import { Permissions } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserInfoFromCookie();

    if (!user.permissions.includes(Permissions.CAN_SEE_WORK_ITEM))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const params = searchParams.get("q") || undefined;

    const result = await fetchAllWorkItems(params);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("search-work-items", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
