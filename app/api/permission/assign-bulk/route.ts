import { assignBulkPermissions } from "@/app/server-actions/permission/assignBulkPermissions";
import type { Permissions } from "@/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: { user_id: string; permission_ids: Permissions[] } =
      await request.json();
    const { user_id, permission_ids } = body;

    if (!user_id || !permission_ids || permission_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing user_id or permission_ids" },
        { status: 400 }
      );
    }

    const data = await assignBulkPermissions({ user_id, permission_ids });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/permission/assign-bulk] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
