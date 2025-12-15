import { removeUserFromTeam } from "@/app/server-actions/user/removeUserFromTeam";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const removeMemberSchema = z.object({
  userId: z.string().min(1, "ID utente è richiesto"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = removeMemberSchema.parse(body);

    const result = await removeUserFromTeam(validatedData.userId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dati non validi",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    logErrorSummary("Error removing team member", error);
    const summary = getErrorSummary(error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Errore nella rimozione del membro dal team",
      },
      { status: 500 }
    );
  }
}
