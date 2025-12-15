import { type NextRequest, NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { getEmployeeWithSkillsById } from "@/app/server-actions/skills/getEmployeeWithSkillsById";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employee = await getEmployeeWithSkillsById(id);

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          error: "Employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    logErrorSummary("Error fetching employee with skills", error);
    const summary = getErrorSummary(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employee with skills",
      },
      { status: 500 }
    );
  }
}
