import { getLatestEmployeeDevelopmentPlan } from "@/app/server-actions/development-plan/getLatestEmployeeDevelopmentPlan";
import { logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing required parameter: userId" }, { status: 400 });
    }

    const result = await getLatestEmployeeDevelopmentPlan(userId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error fetching latest development plan", error);
    return NextResponse.json({ error: "Failed to fetch development plan" }, { status: 500 });
  }
}
