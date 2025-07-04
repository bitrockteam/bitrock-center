"use client";

import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { message } from "@/db";
import { cn } from "@/lib/utils";
import { confirmChatAction } from "@/server/ai/confirmChatAction";
import { createNewChatSession } from "@/server/ai/createNewChatSession";
import { deleteChatSession } from "@/server/ai/deleteChatSession";
import { ChatSession } from "@/server/ai/getChatSessions";
import { smartSearch } from "@/server/ai/service/service";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Check,
  Clock,
  History,
  InfinityIcon,
  Plus,
  Send,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "../ui/switch";
import AiActionRecap from "./ai-action-recap";
import BlobAnimation from "./blob-animation";

export default function AIAssistant({
  chatSessions,
}: {
  chatSessions: ChatSession[];
}) {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [agenticMode, setAgenticMode] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const chat = chatSessions.find((cS) => cS.id === currentSessionId);
    if (chat) {
      setMessages(chat.message);
      setCurrentMessage("");
      setIsThinking(false);
      setCurrentSessionId(chat.id);
    } else {
      setMessages([]);
      setCurrentMessage("");
      setIsThinking(false);
      setCurrentSessionId(null);
    }
  }, [chatSessions, currentSessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Handling submit", currentMessage, currentSessionId);
    if (!currentMessage.trim()) return;
    if (!currentSessionId) return;

    const userMessage: message = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
      chat_session_id: currentSessionId,
      confirmed: false,
      is_json: false,
      json_data: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsThinking(true);

    const response = await smartSearch({
      question: currentMessage,
      chat_session_id: currentSessionId,
    });

    console.info("AI Response:", response);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "bot",
        content: response.output ?? "Non sono riuscito a trovare una risposta.",
        timestamp: new Date(),
        chat_session_id: currentSessionId,
        confirmed: false,
        is_json: response.isJson,
        json_data: response.jsonData || null,
      },
    ]);

    setIsThinking(false);
  };

  const handleJsonAction = async (
    messageId: string,
    action: "confirm" | "cancel",
  ) => {
    if (!currentSessionId) return;
    await confirmChatAction({
      message_id: messageId,
      confirm: action === "confirm",
      chat_session_id: currentSessionId,
    });
  };

  const startNewChat = async () => {
    const chatSession = await createNewChatSession();
    setCurrentSessionId(chatSession.id);
    router.refresh();
  };

  const handleDeleteChat = async (chatSessionId: string) => {
    await deleteChatSession(chatSessionId);
    router.refresh();
  };

  return (
    <div className="flex h-full w-full">
      {/* Chat History Sidebar */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <History className="h-4 w-4" />
              Cronologia Chat
            </h2>
            <Button size="sm" variant="outline" onClick={startNewChat}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="p-2 space-y-2">
            {chatSessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "cursor-pointer transition-colors bg-transparent hover:bg-muted/30 hover:border-cyan-300/30",
                  currentSessionId === session.id && "border-cyan-300",
                )}
                onClick={() => setCurrentSessionId(session.id)}
              >
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 text-ellipsis overflow-hidden whitespace-nowrap hover:underline hover:cursor-pointer max-w-[14rem]">
                      {session.message[0]?.content || "Nuova Chat"}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {session.last_message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {session.last_updated.toLocaleDateString()}{" "}
                      {session.last_updated.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-2 p-1 rounded hover:bg-destructive/10 text-destructive"
                    title="Elimina chat"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(session.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Floating Blob Background */}
        <AnimatePresence mode="wait">
          {!isThinking && (
            <motion.div
              key="blob"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5 }}
              className="pointer-events-none z-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: "22rem", height: "22rem" }}
            >
              <BlobAnimation />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Chat Header */}
        <div className="p-4 border-b z-10 bg-transparent flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">Rocky</h1>
              <p className="text-sm text-muted-foreground">
                Il tuo assistente AI per Bitrock Hours
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Switch
              id="agentic-mode"
              checked={agenticMode}
              onCheckedChange={(checked) => setAgenticMode(checked)}
            />
            <label
              htmlFor="agentic-mode"
              className={cn(
                "text-xs text-muted-foreground flex items-center gap-1 cursor-pointer select-none",
                agenticMode ? "text-primary" : "text-muted-foreground",
              )}
            >
              <InfinityIcon className="h-4 w-4 inline-block" />
              Agentic
            </label>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 overflow-auto">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ciao! Sono Rocky</h3>
                <p className="text-muted-foreground">
                  Sono qui per aiutarti con Bitrock Hours. Chiedi pure quello
                  che vuoi sapere!
                </p>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  message.type === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.type === "bot" && (
                  <div className="bg-primary/10 rounded-full p-2 h-fit">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <p className="text-sm">{message.content}</p>

                  {message.is_json && message.json_data && (
                    <>
                      {message.json_data && (
                        <AiActionRecap data={message.json_data} />
                      )}
                      {message.confirmed === undefined && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleJsonAction(message.id, "confirm")
                            }
                            className="flex-1"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Conferma
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleJsonAction(message.id, "cancel")
                            }
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Annulla
                          </Button>
                        </div>
                      )}
                      {message.confirmed !== undefined && (
                        <div className="mt-3">
                          <Badge
                            variant={
                              message.confirmed ? "default" : "secondary"
                            }
                          >
                            {message.confirmed ? "Confermato" : "Annullato"}
                          </Badge>
                        </div>
                      )}
                    </>
                  )}

                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {message.type === "user" && (
                  <div className="bg-primary/10 rounded-full p-2 h-fit">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="bg-primary/10 rounded-full p-2 h-fit">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Rocky sta scrivendo...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                placeholder="Scrivi un messaggio a Rocky..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="min-h-[50px] max-h-32 resize-none"
                disabled={isThinking}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!currentMessage.trim() || isThinking}
                size="icon"
                className="h-[50px] w-[50px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Premi Invio per inviare, Shift+Invio per andare a capo
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
