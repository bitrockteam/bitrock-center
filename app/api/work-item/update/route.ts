import { updateWorkItem } from "@/app/server-actions/work-item/updateWorkItem";
import { work_item_type } from "@/db";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

const normalizeDateField = (value: unknown) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return null;
    }

    const isoLikeValue =
      trimmedValue.length === 10
        ? `${trimmedValue}T00:00:00.000Z`
        : trimmedValue;

    const parsedDate = new Date(isoLikeValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate;
  }

  return null;
};

export async function PUT(req: NextRequest) {
  try {
    const { id, updates, allocations } = await req.json();

    const normalizedUpdates = {
      ...updates,
      start_date: normalizeDateField(updates?.start_date),
      end_date: normalizeDateField(updates?.end_date),
    };

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

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
    }

    // Validate work item type constraints only if type is being updated
    if (normalizedUpdates.type !== undefined) {
      if (normalizedUpdates.type === work_item_type.time_material) {
        if (
          !normalizedUpdates.hourly_rate ||
          normalizedUpdates.hourly_rate <= 0
        ) {
          return NextResponse.json(
            {
              error:
                "Time & Material work items require a valid hourly_rate > 0",
            },
            { status: 400 }
          );
        }
        if (
          !normalizedUpdates.estimated_hours ||
          normalizedUpdates.estimated_hours <= 0
        ) {
          return NextResponse.json(
            {
              error:
                "Time & Material work items require valid estimated_hours > 0",
            },
            { status: 400 }
          );
        }
        // Ensure fixed_price is null for time-material
        normalizedUpdates.fixed_price = null;
      } else if (normalizedUpdates.type === work_item_type.fixed_price) {
        if (
          !normalizedUpdates.fixed_price ||
          normalizedUpdates.fixed_price <= 0
        ) {
          return NextResponse.json(
            { error: "Fixed Price work items require a valid fixed_price > 0" },
            { status: 400 }
          );
        }
        // Ensure hourly_rate and estimated_hours are null for fixed-price
        normalizedUpdates.hourly_rate = null;
        normalizedUpdates.estimated_hours = null;
      }
    }

    const result = await updateWorkItem(id, normalizedUpdates, allocations);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error updating work item - full error", error);
    const summary = getErrorSummary(error);
    logErrorSummary("update-work-item", error);
    return NextResponse.json(
      { success: false, error: summary.message },
      { status: 500 }
    );
  }
}
