import { NextResponse } from "next/server";
import { fetchTeam } from "@/app/server-actions/user/fetchMyTeam";

export async function GET() {
  try {
    const teamMembers = await fetchTeam();

    return NextResponse.json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Errore nel caricamento dei membri del team",
      },
      { status: 500 }
    );
  }
}
