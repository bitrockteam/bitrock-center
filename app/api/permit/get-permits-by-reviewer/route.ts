import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { getPermitsByReviewer } from "@/app/server-actions/permit/getPermitsByReviewer";

export async function GET() {
  try {
    const result = await getPermitsByReviewer();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error fetching permits by reviewer", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ error: "Failed to fetch permits by reviewer" }, { status: 500 });
  }
}
