import { createAllocation } from "@/app/server-actions/allocation/createAllocation";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addAllocationSchema = z.object({
  work_item_id: z.string().min(1, "Work item ID is required"),
  user_id: z.string().min(1, "User ID is required"),
  percentage: z.number().min(0).max(100),
  start_date: z.string().optional(),
  end_date: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = addAllocationSchema.parse(body);

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
    logErrorSummary("Error adding allocation to work item", error);
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
