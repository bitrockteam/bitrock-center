import { fetchUserPermits } from "@/app/server-actions/permit/fetchUserPermits";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await fetchUserPermits();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching user permits:", error);
    return NextResponse.json(
      { error: "Failed to fetch user permits" },
      { status: 500 },
    );
  }
}
