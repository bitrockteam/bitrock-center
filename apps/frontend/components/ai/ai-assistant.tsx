"use client";

import { useEffect, useRef, useState } from "react";

import { smartSearch } from "@/api/ai/service";
import { confirmChatAction } from "@/api/server/ai/confirmChatAction";
import { createNewChatSession } from "@/api/server/ai/createNewChatSession";
import { ChatSession } from "@/api/server/ai/getChatSessions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { message } from "@bitrock/db";
import { JsonValue } from "@bitrock/db/generated/prisma/runtime/library";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Check, Clock, History, Plus, Send, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
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

    // Simulate AI response

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

  const formatJsonData = (data: JsonValue) => {
    if (!data) return null;

    return (
      <div className="mt-3 p-3 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2">Dettagli:</h4>
        <div className="space-y-2 text-sm">
          {Object.entries(data || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1")}:
              </span>
              <span className="text-muted-foreground">
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
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
                  "cursor-pointer transition-colors bg-transparent hover:bg-muted/30",
                  currentSessionId === session.id && "border-amber-300",
                )}
                onClick={() => setCurrentSessionId(session.id)}
              >
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm mb-1">{session.title}</h3>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b">
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
        </div>

        <AnimatePresence mode="wait">
          {!isThinking && (
            <motion.div
              key="blob"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
              {/* <AIBlob /> */}
              <BlobAnimation />
            </motion.div>
          )}
        </AnimatePresence>

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
                      {formatJsonData(message.json_data)}
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
