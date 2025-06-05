import AIAssistant from "@/components/ai/ai-assistant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant | Bitrock Hours",
  description: "Assistente AI per supporto e informazioni",
};

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <AIAssistant />
    </div>
  );
}
