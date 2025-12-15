import { addUserToTeam } from "@/app/server-actions/user/addUserToTeam";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addMemberSchema = z.object({
  userId: z.string().min(1, "ID utente è richiesto"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = addMemberSchema.parse(body);

    const result = await addUserToTeam(validatedData.userId);

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

    logErrorSummary("add-team-member", error);
    const summary = getErrorSummary(error);
    return NextResponse.json(
      {
        success: false,
        error: summary.message,
      },
      { status: 500 }
    );
  }
}
