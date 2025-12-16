import { deleteProjection } from "@/app/server-actions/saturation/deleteProjection";
import { fetchProjections } from "@/app/server-actions/saturation/fetchProjections";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projections = await fetchProjections();
    const projection = projections.find((p) => p.id === params.id);

    if (!projection) {
      return NextResponse.json({ success: false, error: "Projection not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: projection });
  } catch (error) {
    logErrorSummary("fetch-projection", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description } = await req.json();

    // For now, we'll just validate - actual update can be added later if needed
    if (name && (typeof name !== "string" || name.trim().length === 0)) {
      return NextResponse.json(
        {
          error: "Invalid field: name",
        },
        { status: 400 }
      );
    }

    // TODO: Implement update projection logic if needed
    return NextResponse.json({ success: true, message: "Update not yet implemented" });
  } catch (error) {
    logErrorSummary("update-projection", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteProjection(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logErrorSummary("delete-projection", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

