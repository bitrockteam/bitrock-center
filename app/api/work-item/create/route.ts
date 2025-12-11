import { createWorkItem } from "@/app/server-actions/work-item/createWorkItem";
import { work_item_type } from "@/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { workItem, enabled_users } = await req.json();

    if (!workItem.title || !workItem.client_id || !workItem.type || !workItem.status) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, client_id, type, and status",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(enabled_users)) {
      return NextResponse.json({ error: "enabled_users must be an array" }, { status: 400 });
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
      if (!workItem.estimated_hours || workItem.estimated_hours <= 0) {
        return NextResponse.json(
          {
            error: "Time & Material work items require valid estimated_hours > 0",
          },
          { status: 400 }
        );
      }
      // Ensure fixed_price is null for time-material and convert to integer
      workItem.fixed_price = null;
      workItem.hourly_rate = Math.round(workItem.hourly_rate);
      workItem.estimated_hours = Math.round(workItem.estimated_hours);
    } else if (workItem.type === work_item_type.fixed_price) {
      if (!workItem.fixed_price || workItem.fixed_price <= 0) {
        return NextResponse.json(
          { error: "Fixed Price work items require a valid fixed_price > 0" },
          { status: 400 }
        );
      }
      // Ensure hourly_rate and estimated_hours are null for fixed-price and convert to integer
      workItem.hourly_rate = null;
      workItem.estimated_hours = null;
      workItem.fixed_price = Math.round(workItem.fixed_price);
    }

    const result = await createWorkItem(workItem, enabled_users);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating work item:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create work item";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
