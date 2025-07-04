import { deleteWorkItem } from "@/app/server-actions/work-item/deleteWorkItem";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 },
      );
    }

    const result = await deleteWorkItem(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error deleting work item:", error);
    return NextResponse.json(
      { error: "Failed to delete work item" },
      { status: 500 },
    );
  }
}
