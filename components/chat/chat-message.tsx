"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Markdown } from "./markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 p-4", isUser ? "bg-background" : "bg-muted/50")}>
      <Avatar className="size-8 shrink-0">
        <AvatarFallback>
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="text-sm font-medium">{isUser ? "You" : "Assistant"}</div>
        <div className="text-sm text-muted-foreground">
          <Markdown content={content} />
        </div>
      </div>
    </div>
  );
};
