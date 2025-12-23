import { updateSkill } from "@/app/server-actions/skills/updateSkill";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSkillSchema = z.object({
  id: z.string().min(1, "Skill ID is required"),
  name: z.string().min(1, "Skill name is required"),
  category: z.enum(["hard", "soft"]),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().nullable().optional(),
  active: z.boolean(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateSkillSchema.parse(body);

    // Handle color: convert empty string to null, keep null as null
    const colorValue =
      validatedData.color === "" || validatedData.color === undefined ? null : validatedData.color;

    const skill = await updateSkill({
      ...validatedData,
      description: validatedData.description || null,
      color: colorValue,
    });

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
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

    logErrorSummary("update-skill", error);
    const summary = getErrorSummary(error);

    // Include more details in error response for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: summary.message,
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
