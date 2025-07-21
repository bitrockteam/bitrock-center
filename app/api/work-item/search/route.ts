import { fetchAllWorkItems } from "@/app/server-actions/work-item/fetchAllWorkItems";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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
