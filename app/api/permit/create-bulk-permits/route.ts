import { createBulkPermits } from "@/app/server-actions/permit/createBulkPermits";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createBulkPermits(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create bulk permits";
    console.error("Error creating bulk permits:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
