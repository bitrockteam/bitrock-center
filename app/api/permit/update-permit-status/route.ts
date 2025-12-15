import { updatePermitStatus } from "@/app/server-actions/permit/updatePermitStatus";
import { logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { permitId, status } = body;

    if (!permitId || !status) {
      return NextResponse.json({ error: "permitId and status are required" }, { status: 400 });
    }

    const result = await updatePermitStatus(permitId, status);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error updating permit status", error);
    return NextResponse.json({ error: "Failed to update permit status" }, { status: 500 });
  }
}
