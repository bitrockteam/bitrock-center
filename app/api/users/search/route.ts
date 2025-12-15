import { findUsers } from "@/app/server-actions/user/findUsers";
import { logErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await findUsers();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    logErrorSummary("Error fetching users", error);
    return NextResponse.json(
      {
        success: false,
        error: "Errore nel caricamento degli utenti",
      },
      { status: 500 }
    );
  }
}
