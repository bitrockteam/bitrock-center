import AIAssistant from "@/components/ai/ai-assistant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant | Bitrock Hours",
  description: "Assistente AI per supporto e informazioni",
};

export default function AIAssistantPage() {
  return (
    <div
      className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900"
      style={{ minHeight: "100vh", margin: -16 }}
    >
      <AIAssistant />
    </div>
  );
}
