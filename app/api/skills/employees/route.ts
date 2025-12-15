import { getEmployeesWithSkills } from "@/app/server-actions/skills/getEmployeesWithSkills";
import { logErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const employees = await getEmployeesWithSkills();

    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    logErrorSummary("Error fetching employees with skills", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employees with skills",
      },
      { status: 500 }
    );
  }
}
