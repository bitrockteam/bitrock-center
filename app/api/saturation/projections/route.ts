import { createProjection } from "@/app/server-actions/saturation/createProjection";
import { fetchProjections } from "@/app/server-actions/saturation/fetchProjections";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const projections = await fetchProjections();
    return NextResponse.json({ success: true, data: projections });
  } catch (error) {
    logErrorSummary("fetch-projections", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Missing or invalid required field: name",
        },
        { status: 400 }
      );
    }

    const result = await createProjection(name.trim(), description?.trim());
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("create-projection", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

