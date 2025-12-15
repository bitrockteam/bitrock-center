import { createBulkPermits } from "@/app/server-actions/permit/createBulkPermits";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createBulkPermits(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("create-bulk-permits", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
