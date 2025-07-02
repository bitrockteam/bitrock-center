import { getChatSessions } from "@/api/server/ai/getChatSessions";
import AIAssistant from "@/components/ai/ai-assistant";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant | Bitrock Hours",
  description: "Assistente AI per supporto e informazioni",
};

export default async function AIAssistantPage() {
  const user = await getUserInfoFromCookie();
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Accesso negato. Effettua il login.</p>
      </div>
    );
  }

  const chatSessions = await getChatSessions();

  return (
    <div
      className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900"
      style={{ minHeight: "100vh", margin: -16 }}
    >
      <AIAssistant chatSessions={chatSessions} />
    </div>
  );
}
