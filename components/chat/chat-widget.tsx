"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Minimize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { ChatSessions } from "./chat-sessions";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    sendMessage,
    isLoading,
    sessions,
    currentSessionId,
    isLoadingSessions,
    createSession,
    deleteSession,
    loadSession,
  } = useChat();

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({
          top: scrollViewportRef.current.scrollHeight,
          behavior: "smooth",
        });
      } else if (messagesEndRef.current) {
        // Fallback: scroll the messages end element into view
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  const handleNewChat = async () => {
    await createSession();
    setShowSessions(false);
  };

  const handleSelectSession = async (id: string) => {
    await loadSession(id);
    setShowSessions(false);
  };

  const handleDeleteSession = async (id: string) => {
    await deleteSession(id);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full size-14 shadow-lg"
        >
          <MessageSquare className="size-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col bg-background border rounded-lg shadow-2xl",
          isMinimized ? "w-80 h-16" : "w-[600px] h-[700px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            <h2 className="font-semibold">Chat Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSessions(!showSessions)}
              className="size-8"
            >
              <MessageSquare className="size-4" />
              <span className="sr-only">Toggle sessions</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="size-8"
            >
              <Minimize2 className="size-4" />
              <span className="sr-only">Minimize</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                setIsMinimized(false);
                setShowSessions(false);
              }}
              className="size-8"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex flex-1 overflow-hidden">
            {/* Sessions Sidebar */}
            {showSessions && (
              <div className="w-64 border-r">
                <ChatSessions
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  onSelectSession={handleSelectSession}
                  onCreateSession={handleNewChat}
                  onDeleteSession={handleDeleteSession}
                  isLoading={isLoadingSessions}
                />
              </div>
            )}

            {/* Chat Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea ref={scrollViewportRef} className="flex-1 overflow-y-auto">
                <div className="space-y-1 p-4 min-h-full">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                      <div>
                        <MessageSquare className="size-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Start a conversation with your AI assistant</p>
                        <p className="text-xs mt-2">
                          Ask questions about your projects, timesheets, permits, and more
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      // Extract text content from message parts
                      const textContent =
                        message.parts
                          ?.filter((part) => part.type === "text")
                          .map((part) => {
                            if ("text" in part) {
                              return part.text;
                            }
                            return "";
                          })
                          .join("") || "";

                      return (
                        <ChatMessage
                          key={message.id}
                          role={message.role as "user" | "assistant"}
                          content={textContent}
                        />
                      );
                    })
                  )}
                  {isLoading && (
                    <div className="flex gap-3 p-4 bg-muted/50">
                      <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
                        <div className="size-2 rounded-full bg-muted-foreground animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="text-sm font-medium">Assistant</div>
                        <div className="text-sm text-muted-foreground">Thinking...</div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              </ScrollArea>
              <ChatInput
                value={input}
                onChange={handleInputChange}
                onSend={handleSend}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
