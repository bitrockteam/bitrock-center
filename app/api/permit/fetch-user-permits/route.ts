import { fetchUserPermits } from "@/app/server-actions/permit/fetchUserPermits";
import { logErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await fetchUserPermits();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error fetching user permits", error);
    return NextResponse.json({ error: "Failed to fetch user permits" }, { status: 500 });
  }
}
