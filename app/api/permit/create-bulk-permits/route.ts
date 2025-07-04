import { createBulkPermits } from "@/app/server-actions/permit/createBulkPermits";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createBulkPermits(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating bulk permits:", error);
    return NextResponse.json(
      { error: "Failed to create bulk permits" },
      { status: 500 },
    );
  }
}
