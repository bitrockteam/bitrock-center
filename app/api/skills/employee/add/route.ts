import { addSkillToEmployee } from "@/app/server-actions/skills/addSkillToEmployee";
import type { SeniorityLevel } from "@/db";
import { logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addSkillToEmployeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  skillId: z.string().min(1, "Skill ID is required"),
  seniorityLevel: z.enum(["junior", "mid", "senior", "lead"] as const),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = addSkillToEmployeeSchema.parse(body);

    await addSkillToEmployee(
      validatedData.employeeId,
      validatedData.skillId,
      validatedData.seniorityLevel as SeniorityLevel
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    logErrorSummary("Error adding skill to employee", error);
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
        error: "Failed to add skill to employee",
      },
      { status: 500 }
    );
  }
}
