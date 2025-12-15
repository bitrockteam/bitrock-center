import { type NextRequest, NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { fetchWorkItemTimeEntries } from "@/app/server-actions/work-item/fetchWorkItemTimeEntries";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workItemId = searchParams.get("workItemId");

    if (!workItemId) {
      return NextResponse.json(
        { error: "Missing required parameter: workItemId" },
        { status: 400 }
      );
    }

    const result = await fetchWorkItemTimeEntries(workItemId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error fetching work item time entries", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
