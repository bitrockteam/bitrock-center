"use server";
export async function confirmChatAction({}: {
  chat_session_id: string;
  message_id: string;
  confirm: boolean;
}) {}
