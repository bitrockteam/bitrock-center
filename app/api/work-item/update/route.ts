import { updateWorkItem } from "@/app/server-actions/work-item/updateWorkItem";
import { work_item_type } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { id, updates, enabled_users } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 },
      );
    }

    if (!Array.isArray(enabled_users)) {
      return NextResponse.json(
        { error: "enabled_users must be an array" },
        { status: 400 },
      );
    }

    // Validate work item type constraints
    if (updates.type === work_item_type.time_material) {
      if (!updates.hourly_rate || updates.hourly_rate <= 0) {
        return NextResponse.json(
          {
            error: "Time & Material work items require a valid hourly_rate > 0",
          },
          { status: 400 },
        );
      }
      if (!updates.estimated_hours || updates.estimated_hours <= 0) {
        return NextResponse.json(
          {
            error:
              "Time & Material work items require valid estimated_hours > 0",
          },
          { status: 400 },
        );
      }
      // Ensure fixed_price is null for time-material
      updates.fixed_price = null;
    } else if (updates.type === work_item_type.fixed_price) {
      if (!updates.fixed_price || updates.fixed_price <= 0) {
        return NextResponse.json(
          { error: "Fixed Price work items require a valid fixed_price > 0" },
          { status: 400 },
        );
      }
      // Ensure hourly_rate and estimated_hours are null for fixed-price
      updates.hourly_rate = null;
      updates.estimated_hours = null;
    }

    const result = await updateWorkItem(id, updates, enabled_users);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating work item:", error);
    return NextResponse.json(
      { error: "Failed to update work item" },
      { status: 500 },
    );
  }
}
