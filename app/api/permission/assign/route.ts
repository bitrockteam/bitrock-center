import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { assignPermission } from "@/app/server-actions/permission/assignPermission";
import type { user_permission } from "@/db";

export async function POST(request: Request) {
  try {
    const body: user_permission = await request.json();
    const { user_id, permission_id } = body;

    const data = await assignPermission({ user_id, permission_id });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    logErrorSummary("[POST /api/permission/assign] Error", error);
    const summary = getErrorSummary(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
