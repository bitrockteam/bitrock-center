import { updateSkill } from "@/app/server-actions/skills/updateSkill";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSkillSchema = z.object({
  id: z.string().min(1, "Skill ID is required"),
  name: z.string().min(1, "Skill name is required"),
  category: z.enum(["hard", "soft"]),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  active: z.boolean(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateSkillSchema.parse(body);

    const skill = await updateSkill({
      ...validatedData,
      description: validatedData.description || null,
    });

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("Error updating skill:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update skill",
      },
      { status: 500 },
    );
  }
}
