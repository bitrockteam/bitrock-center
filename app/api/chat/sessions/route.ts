import { createChatSession } from "@/app/server-actions/chat/createSession";
import { deleteChatSession } from "@/app/server-actions/chat/deleteSession";
import { getChatSessions } from "@/app/server-actions/chat/getSessions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sessions = await getChatSessions();
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch sessions",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const session = await createChatSession(title || "New Chat");
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create session",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "sessionId is required" }, { status: 400 });
    }

    await deleteChatSession(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete session",
      },
      { status: 500 }
    );
  }
}
