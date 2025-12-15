import { type NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/app/server-actions/user/updateUser";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import type { user } from "@/db";

export async function PUT(req: NextRequest) {
  try {
    const userData: Partial<Omit<user, "created_at">> = await req.json();

    if (!userData.id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    const result = await updateUser(userData);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("update-user", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
