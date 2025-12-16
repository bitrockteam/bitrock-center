import { createAllocation } from "@/app/server-actions/allocation/createAllocation";
import { deleteAllocation } from "@/app/server-actions/allocation/deleteAllocation";
import { fetchAllAllocations } from "@/app/server-actions/allocation/fetchAllAllocations";
import { updateAllocation } from "@/app/server-actions/allocation/updateAllocation";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createAllocationSchema = z.object({
  work_item_id: z.string().min(1, "Work item ID is required"),
  user_id: z.string().min(1, "User ID is required"),
  percentage: z.number().min(0).max(100),
  start_date: z.string().optional(),
  end_date: z.string().nullable().optional(),
});

const updateAllocationSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  work_item_id: z.string().min(1, "Work item ID is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().optional(),
  percentage: z.number().min(0).max(100),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const work_item_id = searchParams.get("work_item_id");
    const client_id = searchParams.get("client_id");

    const filters: {
      user_id?: string;
      work_item_id?: string;
      client_id?: string;
    } = {};

    if (user_id) filters.user_id = user_id;
    if (work_item_id) filters.work_item_id = work_item_id;
    if (client_id) filters.client_id = client_id;

    const allocations = await fetchAllAllocations(
      Object.keys(filters).length > 0 ? filters : undefined
    );

    return NextResponse.json({ success: true, data: allocations });
  } catch (error) {
    logErrorSummary("Error fetching allocations", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createAllocationSchema.parse(body);

    const startDate = validatedData.start_date ? new Date(validatedData.start_date) : new Date();
    const endDate = validatedData.end_date ? new Date(validatedData.end_date) : null;

    // Validate date range
    if (endDate && startDate > endDate) {
      return NextResponse.json(
        { success: false, error: "Start date must be before or equal to end date" },
        { status: 400 }
      );
    }

    const result = await createAllocation({
      allocation: {
        work_item_id: validatedData.work_item_id,
        user_id: validatedData.user_id,
        percentage: validatedData.percentage,
        start_date: startDate,
        end_date: endDate,
      },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error creating allocation", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.issues,
        },
        { status: 400 }
      );
    }
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = updateAllocationSchema.parse(body);

    const startDate = new Date(validatedData.start_date);
    const endDate = validatedData.end_date ? new Date(validatedData.end_date) : null;

    // Validate date range
    if (endDate && startDate > endDate) {
      return NextResponse.json(
        { success: false, error: "Start date must be before or equal to end date" },
        { status: 400 }
      );
    }

    const result = await updateAllocation({
      user_id: validatedData.user_id,
      work_item_id: validatedData.work_item_id,
      start_date: startDate,
      end_date: endDate,
      percentage: validatedData.percentage,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error updating allocation", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.issues,
        },
        { status: 400 }
      );
    }
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const work_item_id = searchParams.get("work_item_id");
    const user_id = searchParams.get("user_id");

    if (!work_item_id || !user_id) {
      return NextResponse.json(
        { success: false, error: "work_item_id and user_id are required" },
        { status: 400 }
      );
    }

    await deleteAllocation({
      work_item_id,
      user_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logErrorSummary("Error deleting allocation", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ success: false, error: summary.message }, { status: 500 });
  }
}
