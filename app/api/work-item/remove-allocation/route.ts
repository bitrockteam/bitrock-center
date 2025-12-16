import { deleteAllocation } from "@/app/server-actions/allocation/deleteAllocation";
import { getErrorSummary, logErrorSummary } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const removeAllocationSchema = z.object({
  work_item_id: z.string().min(1, "Work item ID is required"),
  user_id: z.string().min(1, "User ID is required"),
});

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const work_item_id = searchParams.get("work_item_id");
    const user_id = searchParams.get("user_id");

    const validatedData = removeAllocationSchema.parse({
      work_item_id,
      user_id,
    });

    await deleteAllocation({
      work_item_id: validatedData.work_item_id,
      user_id: validatedData.user_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logErrorSummary("Error removing allocation from work item", error);
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

