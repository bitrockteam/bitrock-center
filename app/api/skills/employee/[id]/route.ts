import { getEmployeeWithSkillsById } from "@/app/server-actions/skills/getEmployeeWithSkillsById";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const employee = await getEmployeeWithSkillsById(id);

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          error: "Employee not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching employee with skills:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employee with skills",
      },
      { status: 500 },
    );
  }
}
