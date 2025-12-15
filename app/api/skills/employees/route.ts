import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { getEmployeesWithSkills } from "@/app/server-actions/skills/getEmployeesWithSkills";

export async function GET() {
  try {
    const employees = await getEmployeesWithSkills();

    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    logErrorSummary("Error fetching employees with skills", error);
    const summary = getErrorSummary(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employees with skills",
      },
      { status: 500 }
    );
  }
}
