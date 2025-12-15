import { createClient, getUserInfoFromCookie } from "@/utils/supabase/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userInfo = await getUserInfoFromCookie();
    if (!userInfo) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, type, content, isJson, jsonData } = await request.json();

    if (!sessionId || !type || !content) {
      return NextResponse.json(
        { success: false, error: "sessionId, type, and content are required" },
        { status: 400 }
      );
    }

    // Verify the session belongs to the user
    const supabase = await createClient();
    const { data: session, error: sessionError } = await supabase
      .from("chat_session")
      .select("id")
      .eq("id", sessionId)
      .eq("user_id", userInfo.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: "Chat session not found or access denied" },
        { status: 403 }
      );
    }

    // Map 'assistant' to 'bot' to match database constraint
    const messageType = type === "assistant" ? "bot" : type;

    // Insert the message
    const { data: message, error: messageError } = await supabase
      .from("message")
      .insert({
        chat_session_id: sessionId,
        type: messageType,
        content,
        is_json: isJson || false,
        json_data: jsonData || null,
      })
      .select()
      .single();

    if (messageError) {
      throw new Error(`Error saving message: ${messageError.message}`);
    }

    // Update the session's last_message and last_updated
    const lastMessagePreview = content.length > 100 ? `${content.substring(0, 100)}...` : content;
    await supabase
      .from("chat_session")
      .update({
        last_message: lastMessagePreview,
        last_updated: new Date().toISOString(),
      })
      .eq("id", sessionId);

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    logErrorSummary("save-message", error);
    const summary = getErrorSummary(error);
    return NextResponse.json(
      {
        success: false,
        error: summary.message,
      },
      { status: 500 }
    );
  }
}
