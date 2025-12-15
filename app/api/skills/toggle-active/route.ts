import { toggleSkillActive } from "@/app/server-actions/skills/toggleSkillActive";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const toggleSkillActiveSchema = z.object({
  id: z.string().min(1, "Skill ID is required"),
  active: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = toggleSkillActiveSchema.parse(body);

    await toggleSkillActive(validatedData.id, validatedData.active);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    logErrorSummary("Error toggling skill active status", error);
    const summary = getErrorSummary(error);
    console.log(summary);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to toggle skill active status",
      },
      { status: 500 }
    );
  }
}
