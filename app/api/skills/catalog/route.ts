import { getSkillsCatalog } from "@/app/server-actions/skills/getSkillsCatalog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const skills = await getSkillsCatalog();

    return NextResponse.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Error fetching skills catalog:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skills catalog",
      },
      { status: 500 },
    );
  }
}
