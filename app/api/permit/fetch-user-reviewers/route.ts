import { fetchUserReviewers } from "@/app/server-actions/permit/fetchUserReviewers";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await fetchUserReviewers();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("fetch-user-reviewers", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
