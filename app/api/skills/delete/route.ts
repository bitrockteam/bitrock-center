import { deleteSkill } from "@/app/server-actions/skills/deleteSkill";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const deleteSkillSchema = z.object({
  id: z.string().min(1, "Skill ID is required"),
});

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = deleteSkillSchema.parse(body);

    await deleteSkill(validatedData.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting skill:", error);

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
        error: "Failed to delete skill",
      },
      { status: 500 },
    );
  }
}
