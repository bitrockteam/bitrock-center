import { type NextRequest, NextResponse } from "next/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { uploadFile } from "@/app/server-actions/user/uploadFile";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadFile({ file: formData });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logErrorSummary("Error uploading file", error);
    const summary = getErrorSummary(error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
