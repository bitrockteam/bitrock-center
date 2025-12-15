import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { getAllClients } from "@/app/server-actions/client/getAllClients";

export async function GET() {
  try {
    const clients = await getAllClients();
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    logErrorSummary("Error fetching clients", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}
