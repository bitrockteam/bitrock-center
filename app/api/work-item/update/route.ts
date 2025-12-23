import { updateWorkItem } from "@/app/server-actions/work-item/updateWorkItem";
import { fetchWorkItemById } from "@/app/server-actions/work-item/fetchWorkItemById";
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
      trimmedValue.length === 10 ? `${trimmedValue}T00:00:00.000Z` : trimmedValue;

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
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
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

    // Get current work item to determine type if not being updated
    const currentWorkItem = await fetchWorkItemById({ workItemId: id });
    if (!currentWorkItem) {
      return NextResponse.json({ error: "Work item not found" }, { status: 404 });
    }

    // Determine the work item type (use updated type if provided, otherwise use current type)
    const workItemType = normalizedUpdates.type ?? currentWorkItem.type;

    // Validate work item type constraints
    if (workItemType === work_item_type.time_material) {
      // If type is being changed to time_material, hourly_rate must be provided
      if (
        normalizedUpdates.type === work_item_type.time_material &&
        normalizedUpdates.hourly_rate === undefined
      ) {
        return NextResponse.json(
          {
            error: "Time & Material work items require a valid hourly_rate > 0",
          },
          { status: 400 }
        );
      }

      // If hourly_rate is being updated (including when it's explicitly set), validate it
      if (normalizedUpdates.hourly_rate !== undefined) {
        if (normalizedUpdates.hourly_rate === null || normalizedUpdates.hourly_rate <= 0) {
          return NextResponse.json(
            {
              error: "Time & Material work items require a valid hourly_rate > 0",
            },
            { status: 400 }
          );
        }
        // Convert to integer
        normalizedUpdates.hourly_rate = Math.round(normalizedUpdates.hourly_rate);
      } else {
        // If hourly_rate is not being updated, ensure current value is valid
        if (!currentWorkItem.hourly_rate || currentWorkItem.hourly_rate <= 0) {
          return NextResponse.json(
            {
              error: "Time & Material work items require a valid hourly_rate > 0",
            },
            { status: 400 }
          );
        }
      }

      // Ensure fixed_price is null for time-material
      normalizedUpdates.fixed_price = null;
    } else if (workItemType === work_item_type.fixed_price) {
      // If type is being changed to fixed_price, fixed_price must be provided
      if (
        normalizedUpdates.type === work_item_type.fixed_price &&
        normalizedUpdates.fixed_price === undefined
      ) {
        return NextResponse.json(
          { error: "Fixed Price work items require a valid fixed_price > 0" },
          { status: 400 }
        );
      }

      // If fixed_price is being updated (including when it's explicitly set), validate it
      if (normalizedUpdates.fixed_price !== undefined) {
        if (normalizedUpdates.fixed_price === null || normalizedUpdates.fixed_price <= 0) {
          return NextResponse.json(
            { error: "Fixed Price work items require a valid fixed_price > 0" },
            { status: 400 }
          );
        }
        // Convert to integer
        normalizedUpdates.fixed_price = Math.round(normalizedUpdates.fixed_price);
      } else {
        // If fixed_price is not being updated, ensure current value is valid
        if (!currentWorkItem.fixed_price || currentWorkItem.fixed_price <= 0) {
          return NextResponse.json(
            { error: "Fixed Price work items require a valid fixed_price > 0" },
            { status: 400 }
          );
        }
      }

      // Ensure hourly_rate is null for fixed-price
      normalizedUpdates.hourly_rate = null;
    }

    const result = await updateWorkItem(id, normalizedUpdates, allocations);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error updating work item - full error", error);
    const summary = getErrorSummary(error);
    logErrorSummary("update-work-item", error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
