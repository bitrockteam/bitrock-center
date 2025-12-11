import { updateUserDaysOff } from "@/app/server-actions/user/updateUserDaysOff";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, daysOffLeft, daysOffPlanned } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId è richiesto",
        },
        { status: 400 }
      );
    }

    const updated = await updateUserDaysOff({
      userId,
      daysOffLeft: daysOffLeft !== undefined ? daysOffLeft : null,
      daysOffPlanned: daysOffPlanned !== undefined ? daysOffPlanned : null,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating user days off:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Errore nell'aggiornamento dei giorni di ferie",
      },
      { status: 500 }
    );
  }
}
