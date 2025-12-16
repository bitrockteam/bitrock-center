import { updateProjectionAllocations } from "@/app/server-actions/saturation/updateProjectionAllocations";
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

    return NextResponse.json({ success: true, data: projection.allocations });
  } catch (error) {
    logErrorSummary("fetch-projection-allocations", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { allocations } = await req.json();

    if (!Array.isArray(allocations)) {
      return NextResponse.json(
        { error: "allocations must be an array" },
        { status: 400 }
      );
    }

    // Validate allocations structure
    for (const alloc of allocations) {
      if (!alloc.user_id || typeof alloc.percentage !== "number") {
        return NextResponse.json(
          { error: "Each allocation must have user_id and percentage" },
          { status: 400 }
        );
      }
      if (alloc.percentage < 0 || alloc.percentage > 100) {
        return NextResponse.json(
          { error: "Percentage must be between 0 and 100" },
          { status: 400 }
        );
      }
      if (!alloc.start_date) {
        return NextResponse.json(
          { error: "Each allocation must have start_date" },
          { status: 400 }
        );
      }
    }

    // Convert dates from strings to Date objects
    const processedAllocations = allocations.map((alloc) => ({
      ...alloc,
      start_date: typeof alloc.start_date === "string" ? new Date(alloc.start_date) : alloc.start_date,
      end_date: alloc.end_date
        ? typeof alloc.end_date === "string"
          ? new Date(alloc.end_date)
          : alloc.end_date
        : null,
    }));

    await updateProjectionAllocations(params.id, processedAllocations);
    return NextResponse.json({ success: true });
  } catch (error) {
    logErrorSummary("update-projection-allocations", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

