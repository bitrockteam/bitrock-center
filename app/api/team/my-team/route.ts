import { NextResponse } from "next/server";
import { fetchMyTeam } from "@/app/server-actions/user/fetchTeam";

export async function GET() {
  try {
    const myTeamData = await fetchMyTeam();

    return NextResponse.json({
      success: true,
      data: myTeamData,
    });
  } catch (error) {
    console.error("Error fetching my team data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Errore nel caricamento dei dati del team",
      },
      { status: 500 }
    );
  }
}
