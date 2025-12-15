import { NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { getSkillsCatalog } from "@/app/server-actions/skills/getSkillsCatalog";

export async function GET() {
  try {
    const skills = await getSkillsCatalog();

    return NextResponse.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    logErrorSummary("Error fetching skills catalog", error);
    const summary = getErrorSummary(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skills catalog",
      },
      { status: 500 }
    );
  }
}
