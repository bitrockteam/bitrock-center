"use client";
import { ChatSession } from "@/api/server/ai/getChatSessions";
import AIAssistant from "./ai-assistant";

export default function AIAssistantClientWrapper({
  chatSessions,
}: {
  chatSessions: ChatSession[];
}) {
  return <AIAssistant chatSessions={chatSessions} />;
}
