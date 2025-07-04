import { getAllClients } from "@/app/server-actions/client/getAllClients";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clients = await getAllClients();
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 },
    );
  }
}
