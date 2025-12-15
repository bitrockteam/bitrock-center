import { type NextRequest, NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { getContractByEmployeeId } from "@/app/server-actions/contract/getContractByEmployeeId";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { error: "Missing required parameter: employeeId" },
        { status: 400 }
      );
    }

    const result = await getContractByEmployeeId(employeeId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error fetching contract", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ error: "Failed to fetch contract" }, { status: 500 });
  }
}
