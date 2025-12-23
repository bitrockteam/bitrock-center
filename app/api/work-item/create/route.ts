import { createWorkItem } from "@/app/server-actions/work-item/createWorkItem";
import { work_item_type } from "@/db";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { workItem, allocations } = await req.json();

    if (!workItem.title || !workItem.client_id || !workItem.type || !workItem.status) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, client_id, type, and status",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(allocations)) {
      return NextResponse.json({ error: "allocations must be an array" }, { status: 400 });
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
    }

    // Convert start_date from string to Date, or use today's date if not provided
    if (!workItem.start_date) {
      workItem.start_date = new Date();
    } else {
      // Handle both string (YYYY-MM-DD) and Date object formats
      workItem.start_date =
        typeof workItem.start_date === "string"
          ? new Date(workItem.start_date)
          : new Date(workItem.start_date);
    }

    // Convert end_date from string to Date if provided
    if (workItem.end_date) {
      workItem.end_date =
        typeof workItem.end_date === "string"
          ? new Date(workItem.end_date)
          : new Date(workItem.end_date);
    }

    // Validate work item type constraints
    if (workItem.type === work_item_type.time_material) {
      if (!workItem.hourly_rate || workItem.hourly_rate <= 0) {
        return NextResponse.json(
          {
            error: "Time & Material work items require a valid hourly_rate > 0",
          },
          { status: 400 }
        );
      }
      // Ensure fixed_price is null for time-material and convert to integer
      workItem.fixed_price = null;
      workItem.hourly_rate = Math.round(workItem.hourly_rate);
    } else if (workItem.type === work_item_type.fixed_price) {
      if (!workItem.fixed_price || workItem.fixed_price <= 0) {
        return NextResponse.json(
          { error: "Fixed Price work items require a valid fixed_price > 0" },
          { status: 400 }
        );
      }
      // Ensure hourly_rate is null for fixed-price and convert to integer
      workItem.hourly_rate = null;
      workItem.fixed_price = Math.round(workItem.fixed_price);
    }

    const result = await createWorkItem(workItem, allocations);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("create-work-item", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
