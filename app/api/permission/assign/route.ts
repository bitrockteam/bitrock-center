import { NextResponse } from "next/server";
import { z } from "zod";
import { assignPermission } from "@/app/server-actions/permission/assignPermission";
import { Permissions } from "@/db";

const BodySchema = z.object({
  userId: z.string().uuid(),
  permissionId: z.nativeEnum(Permissions),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, permissionId } = BodySchema.parse(body);

    const data = await assignPermission({ userId, permissionId });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/permission/assign] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
