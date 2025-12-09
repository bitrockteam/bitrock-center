import { NextResponse } from "next/server";
import { removePermission } from "@/app/server-actions/permission/removePermission";
import type { user_permission } from "@/db";

export async function DELETE(request: Request) {
  try {
    const body: user_permission = await request.json();
    const { user_id, permission_id } = body;

    const data = await removePermission({ user_id, permission_id });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/permission/remove] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
