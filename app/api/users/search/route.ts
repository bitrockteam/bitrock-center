import { NextResponse } from "next/server";
import { findUsers } from "@/app/server-actions/user/findUsers";

export async function GET() {
  try {
    const users = await findUsers();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Errore nel caricamento degli utenti",
      },
      { status: 500 }
    );
  }
}
