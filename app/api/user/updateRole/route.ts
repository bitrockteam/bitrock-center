import { type NextRequest, NextResponse } from "next/server";
import { updateUserRole } from "@/app/server-actions/user/updateUserRole";
import { Role } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing required fields: userId and role" },
        { status: 400 }
      );
    }

    if (!Object.values(Role).includes(role)) {
      return NextResponse.json({ error: "Invalid role provided" }, { status: 400 });
    }

    const result = await updateUserRole(userId, role);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
