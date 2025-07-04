import { fetchUserReviewers } from "@/app/server-actions/permit/fetchUserReviewers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await fetchUserReviewers();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching user reviewers:", error);
    return NextResponse.json(
      { error: "Failed to fetch user reviewers" },
      { status: 500 },
    );
  }
}
