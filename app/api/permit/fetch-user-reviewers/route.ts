import { NextResponse } from "next/server";
import { fetchUserReviewers } from "@/app/server-actions/permit/fetchUserReviewers";

export async function GET() {
  try {
    const result = await fetchUserReviewers();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching user reviewers:", error);
    return NextResponse.json({ error: "Failed to fetch user reviewers" }, { status: 500 });
  }
}
