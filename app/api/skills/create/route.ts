import { createNewSkill } from "@/app/server-actions/skills/createNewSkill";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.enum(["hard", "soft"]),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  active: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSkillSchema.parse(body);

    const skill = await createNewSkill({
      ...validatedData,
      description: validatedData.description || null,
    });

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("Error creating skill:", error);

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
        error: "Failed to create skill",
      },
      { status: 500 }
    );
  }
}
