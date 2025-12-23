import { type NextRequest, NextResponse } from "next/server";
import { deleteClient } from "@/app/server-actions/client/deleteClient";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 });
    }

    const result = await deleteClient(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("delete-client", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
