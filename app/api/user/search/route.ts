import { type NextRequest, NextResponse } from "next/server";
import { findUsers } from "@/app/server-actions/user/findUsers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || undefined;

    const result = await findUsers(search);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}
