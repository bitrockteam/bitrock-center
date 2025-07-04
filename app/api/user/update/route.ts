import { updateUser } from "@/app/server-actions/user/updateUser";
import { user } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const userData: Partial<Omit<user, "created_at">> = await req.json();

    if (!userData.id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 },
      );
    }

    const result = await updateUser(userData);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
