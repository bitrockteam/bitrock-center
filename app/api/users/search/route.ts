import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { findUsers } from "@/app/server-actions/user/findUsers";

export async function GET() {
  try {
    const users = await findUsers();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    logErrorSummary("Error fetching users", error);
    const summary = getErrorSummary(error);
    return NextResponse.json(
      {
        success: false,
        error: "Errore nel caricamento degli utenti",
      },
      { status: 500 }
    );
  }
}
