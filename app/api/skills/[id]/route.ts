import { getSkillById } from "@/app/server-actions/skills/getSkillById";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skill = await getSkillById(id);

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          error: "Skill not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    logErrorSummary("Error fetching skill", error);
    const summary = getErrorSummary(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skill",
      },
      { status: 500 }
    );
  }
}
