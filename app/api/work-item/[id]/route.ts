import { fetchWorkItemById } from "@/app/server-actions/work-item/fetchWorkItemById";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const workItem = await fetchWorkItemById({ workItemId: id });

    if (!workItem) {
      return NextResponse.json({ success: false, error: "Work item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: workItem });
  } catch (error) {
    logErrorSummary("Error fetching work item", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
