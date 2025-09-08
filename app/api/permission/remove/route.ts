import { NextResponse } from "next/server";
import { z } from "zod";
import { removePermission } from "@/app/server-actions/permission/removePermission";
import { Permissions } from "@/db";

const BodySchema = z.object({
  userId: z.string().uuid(),
  permissionId: z.nativeEnum(Permissions),
});

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, permissionId } = BodySchema.parse(body);

    const data = await removePermission({ userId, permissionId });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/permission/remove] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
