import { NextResponse } from "next/server";
import { getPermitsByReviewer } from "@/app/server-actions/permit/getPermitsByReviewer";

export async function GET() {
  try {
    const result = await getPermitsByReviewer();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching permits by reviewer:", error);
    return NextResponse.json({ error: "Failed to fetch permits by reviewer" }, { status: 500 });
  }
}
