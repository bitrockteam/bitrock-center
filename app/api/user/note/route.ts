import { updateUserNote } from "@/app/server-actions/user/updateUserNote";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateUserNoteSchema = z.object({
  userId: z.string().min(1, "userId è richiesto"),
  note: z.string().max(5000, "La nota non può superare i 5000 caratteri").nullable(),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = updateUserNoteSchema.parse(body);

    const updated = await updateUserNote({
      userId: validated.userId,
      note: validated.note,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    logErrorSummary("Error updating user note", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Dati non validi", details: error.issues },
        { status: 400 }
      );
    }
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}


