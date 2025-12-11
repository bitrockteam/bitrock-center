import { fetchUserReviewers } from "@/app/server-actions/permit/fetchUserReviewers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await fetchUserReviewers();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch user reviewers";
    console.error("Error fetching user reviewers:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
