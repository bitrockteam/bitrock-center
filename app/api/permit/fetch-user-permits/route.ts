import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { fetchUserPermits } from "@/app/server-actions/permit/fetchUserPermits";

export async function GET() {
  try {
    const result = await fetchUserPermits();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error fetching user permits", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ error: "Failed to fetch user permits" }, { status: 500 });
  }
}
