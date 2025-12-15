import { type NextRequest, NextResponse } from "next/server";
import { findUsers } from "@/app/server-actions/user/findUsers";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || undefined;

    const result = await findUsers(search);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("search-users", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
