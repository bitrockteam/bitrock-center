import { fetchWorkItemsForAllocation } from "@/app/server-actions/allocation/fetchWorkItemsForAllocation";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const client_id = searchParams.get("client_id");
    const project_id = searchParams.get("project_id");

    if (!client_id) {
      return NextResponse.json({ success: false, error: "client_id is required" }, { status: 400 });
    }

    const workItems = await fetchWorkItemsForAllocation({
      client_id,
      project_id: project_id || undefined,
    });

    return NextResponse.json({ success: true, data: workItems });
  } catch (error) {
    logErrorSummary("Error fetching work items for allocation", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
