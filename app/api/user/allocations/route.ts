import { fetchUserAllocations } from "@/app/server-actions/user/fetchUserAllocations";
import { logErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId è richiesto",
        },
        { status: 400 }
      );
    }

    const allocationsData = await fetchUserAllocations(userId);

    return NextResponse.json({
      success: true,
      data: allocationsData,
    });
  } catch (error) {
    logErrorSummary("Error fetching user allocations", error);
    return NextResponse.json(
      {
        success: false,
        error: "Errore nel caricamento delle allocazioni",
      },
      { status: 500 }
    );
  }
}
