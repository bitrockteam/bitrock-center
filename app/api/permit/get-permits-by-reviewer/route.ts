import { getPermitsByReviewer } from "@/app/server-actions/permit/getPermitsByReviewer";
import { logErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getPermitsByReviewer();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error fetching permits by reviewer", error);
    return NextResponse.json({ error: "Failed to fetch permits by reviewer" }, { status: 500 });
  }
}
