import { updateEmployeeSkillLevel } from "@/app/server-actions/skills/updateEmployeeSkillLevel";
import { SeniorityLevel } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateEmployeeSkillLevelSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  skillId: z.string().min(1, "Skill ID is required"),
  seniorityLevel: z.enum(["junior", "mid", "senior", "lead"] as const),
});

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateEmployeeSkillLevelSchema.parse(body);

    await updateEmployeeSkillLevel(
      validatedData.employeeId,
      validatedData.skillId,
      validatedData.seniorityLevel as SeniorityLevel,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error updating employee skill level:", error);

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
        error: "Failed to update employee skill level",
      },
      { status: 500 },
    );
  }
}
