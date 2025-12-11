import { removeSkillFromEmployee } from "@/app/server-actions/skills/removeSkillFromEmployee";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const removeSkillFromEmployeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  skillId: z.string().min(1, "Skill ID is required"),
});

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = removeSkillFromEmployeeSchema.parse(body);

    await removeSkillFromEmployee(validatedData.employeeId, validatedData.skillId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error removing skill from employee:", error);

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
        error: "Failed to remove skill from employee",
      },
      { status: 500 }
    );
  }
}
