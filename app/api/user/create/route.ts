import { type NextRequest, NextResponse } from "next/server";
import { createUser } from "@/app/server-actions/user/createUser";
import type { user } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const userData: Partial<Omit<user, "id" | "created_at">> = await req.json();

    if (!userData.name || !userData.email || !userData.role) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and role" },
        { status: 400 }
      );
    }

    const result = await createUser(userData);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
