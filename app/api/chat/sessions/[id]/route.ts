import { deleteChatSession } from "@/app/server-actions/chat/deleteSession";
import { getChatMessages } from "@/app/server-actions/chat/getMessages";
import { logErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const messages = await getChatMessages(id);
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    logErrorSummary("Error fetching messages", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch messages",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteChatSession(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logErrorSummary("Error deleting chat session", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete session",
      },
      { status: 500 }
    );
  }
}
