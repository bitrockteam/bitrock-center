import { type NextRequest, NextResponse } from "next/server";
import { createWorkItem } from "@/app/server-actions/work-item/createWorkItem";
import { work_item_type } from "@/db";

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
      // Ensure fixed_price is null for time-material
      workItem.fixed_price = null;
    } else if (workItem.type === work_item_type.fixed_price) {
      if (!workItem.fixed_price || workItem.fixed_price <= 0) {
        return NextResponse.json(
          { error: "Fixed Price work items require a valid fixed_price > 0" },
          { status: 400 }
        );
      }
      // Ensure hourly_rate and estimated_hours are null for fixed-price
      workItem.hourly_rate = null;
      workItem.estimated_hours = null;
    }

    const result = await createWorkItem(workItem, enabled_users);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating work item:", error);
    return NextResponse.json({ error: "Failed to create work item" }, { status: 500 });
  }
}
