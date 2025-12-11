"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatSession } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ChatSessionsProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  isLoading?: boolean;
}

export const ChatSessions = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  isLoading = false,
}: ChatSessionsProps) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(id);
    try {
      await onDeleteSession(id);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <Button onClick={onCreateSession} className="w-full" size="sm" disabled={isLoading}>
          <Plus className="size-4 mr-2" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={cn(
                "group flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors w-full text-left",
                currentSessionId === session.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare className="size-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{session.title}</div>
                {session.last_message && (
                  <div className="text-xs opacity-70 truncate">{session.last_message}</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 opacity-0 group-hover:opacity-100 shrink-0"
                onClick={(e) => handleDelete(session.id, e)}
                disabled={isDeleting === session.id}
              >
                <Trash2 className="size-3" />
                <span className="sr-only">Delete session</span>
              </Button>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
