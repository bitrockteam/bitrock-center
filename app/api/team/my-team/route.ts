import { fetchMyTeam } from "@/app/server-actions/user/fetchTeam";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const myTeamData = await fetchMyTeam();

    return NextResponse.json({
      success: true,
      data: myTeamData,
    });
  } catch (error) {
    logErrorSummary("Error fetching my team data", error);
    const summary = getErrorSummary(error);
    console.log(summary);
    return NextResponse.json(
      {
        success: false,
        error: "Errore nel caricamento dei dati del team",
      },
      { status: 500 }
    );
  }
}
