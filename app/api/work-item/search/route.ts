import { fetchAllWorkItems } from "@/app/server-actions/work-item/fetchAllWorkItems";
import { Permissions } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserInfoFromCookie();

    if (!user.permissions.includes(Permissions.CAN_SEE_WORK_ITEM))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const params = searchParams.get("q") || undefined;

    const result = await fetchAllWorkItems(params);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error searching work items:", error);
    return NextResponse.json(
      { error: "Failed to search work items" },
      { status: 500 },
    );
  }
}
