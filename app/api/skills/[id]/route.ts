import { getSkillById } from "@/app/server-actions/skills/getSkillById";
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
    console.error("Error fetching skill:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skill",
      },
      { status: 500 }
    );
  }
}
