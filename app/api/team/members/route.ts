import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { fetchTeam } from "@/app/server-actions/user/fetchMyTeam";

export async function GET() {
  try {
    const teamMembers = await fetchTeam();

    return NextResponse.json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    logErrorSummary("Error fetching team members", error);
    const summary = getErrorSummary(error);
    return NextResponse.json(
      {
        success: false,
        error: "Errore nel caricamento dei membri del team",
      },
      { status: 500 }
    );
  }
}
