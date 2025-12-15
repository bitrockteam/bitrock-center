"use client";

import { useChat as useAIChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  last_message: string | null;
  last_updated: string;
}

export const useChat = (sessionId?: string) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionId);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [input, setInput] = useState("");
  const fetchSessionsRef = useRef<(() => Promise<void>) | null>(null);
  const loadSessionRef = useRef<((id: string) => Promise<void>) | null>(null);
  const sessionIdRef = useRef<string | undefined>(currentSessionId);

  // Keep ref in sync with state
  useEffect(() => {
    sessionIdRef.current = currentSessionId;
  }, [currentSessionId]);

  const fetchSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const response = await fetch("/api/chat/sessions");
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  // Store fetchSessions in ref so it can be accessed in onFinish
  fetchSessionsRef.current = fetchSessions;

  // Create transport with prepareSendMessagesRequest that uses ref for sessionId
  const transport = useRef(
    new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages, id }) => {
        return {
          body: {
            messages,
            id,
            sessionId: sessionIdRef.current,
          },
        };
      },
    })
  ).current;

  const {
    messages,
    status,
    sendMessage: aiSendMessage,
    setMessages,
    error,
    regenerate,
    stop,
  } = useAIChat({
    transport,
    onFinish: async (options) => {
      console.log("=== onFinish triggered ===", {
        hasMessage: !!options.message,
        messageId: options.message?.id,
        finishReason: options.finishReason,
        messageStructure: options.message ? JSON.stringify(options.message, null, 2) : null,
      });
      const finishId = Math.random().toString(36).substring(7);
      console.log(`[onFinish:${finishId}] ===== ON FINISH CALLBACK START =====`);
      console.log(`[onFinish:${finishId}] Options:`, {
        hasMessage: !!options.message,
        hasFinishReason: !!options.finishReason,
        finishReason: options.finishReason,
        messageParts: options.message?.parts,
        messagePartsLength: options.message?.parts?.length,
        messagePartsTypes: options.message?.parts?.map((p: { type: string }) => p.type),
      });

      // Save assistant message to database (including errors)
      if (sessionIdRef.current && options.message) {
        try {
          console.log(`[onFinish:${finishId}] Step 1: Extracting text content from message...`);
          // Extract text content from the message
          const textContent =
            options.message.parts
              ?.filter((part) => part.type === "text")
              .map((part) => (part as { text: string }).text)
              .join("") || "";

          // Save even if content is empty (for error cases)
          const contentToSave = textContent || "No response generated";

          console.log(`[onFinish:${finishId}] Content extracted:`, {
            sessionId: sessionIdRef.current,
            contentLength: contentToSave.length,
            hasContent: !!textContent,
            preview: contentToSave.substring(0, 100),
          });

          console.log(`[onFinish:${finishId}] Step 2: Saving message to database...`);
          const saveStart = Date.now();
          const response = await fetch("/api/chat/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionIdRef.current,
              type: "bot",
              content: contentToSave,
            }),
          });
          const saveTime = Date.now() - saveStart;

          if (!response.ok) {
            const errorData = await response.json();
            console.error(
              `[onFinish:${finishId}] Error saving message (${saveTime}ms):`,
              errorData
            );
          } else {
            const responseData = await response.json();
            console.log(`[onFinish:${finishId}] Message saved successfully (${saveTime}ms):`, {
              messageId: responseData.data?.id,
            });
          }

          console.log(`[onFinish:${finishId}] Step 3: Refreshing sessions...`);
          // Refresh sessions to update last_message
          if (fetchSessionsRef.current) {
            await fetchSessionsRef.current();
            console.log(`[onFinish:${finishId}] Sessions refreshed`);
          }

          console.log(`[onFinish:${finishId}] Step 4: Reloading session messages to update UI...`);
          // Reload messages to show the new assistant message in the UI
          if (sessionIdRef.current && loadSessionRef.current) {
            try {
              await loadSessionRef.current(sessionIdRef.current);
              console.log(`[onFinish:${finishId}] Session messages reloaded`);
            } catch (reloadError) {
              console.error(`[onFinish:${finishId}] Error reloading session:`, reloadError);
            }
          } else {
            console.warn(
              `[onFinish:${finishId}] Cannot reload - missing sessionId or loadSession:`,
              {
                hasSessionId: !!sessionIdRef.current,
                hasLoadSession: !!loadSessionRef.current,
              }
            );
          }

          console.log(`[onFinish:${finishId}] ===== ON FINISH CALLBACK END =====`);
        } catch (error) {
          console.error(`[onFinish:${finishId}] Exception saving assistant message:`, error);
        }
      } else {
        console.warn(`[onFinish:${finishId}] Cannot save message - missing sessionId or message:`, {
          hasSessionId: !!sessionIdRef.current,
          hasMessage: !!options.message,
        });
      }
    },
    onError: async (error) => {
      const errorId = Math.random().toString(36).substring(7);
      console.error(`[onError:${errorId}] ===== ON ERROR CALLBACK START =====`);
      console.error(`[onError:${errorId}] Chat error:`, error);

      // Also save error messages
      if (sessionIdRef.current) {
        try {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

          console.log(`[onError:${errorId}] Saving error message to database...`);
          const response = await fetch("/api/chat/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionIdRef.current,
              type: "bot",
              content: `Error: ${errorMessage}`,
            }),
          });

          if (response.ok) {
            console.log(`[onError:${errorId}] Error message saved successfully`);
          } else {
            const errorData = await response.json();
            console.error(`[onError:${errorId}] Failed to save error message:`, errorData);
          }
        } catch (saveError) {
          console.error(`[onError:${errorId}] Exception saving error message:`, saveError);
        }
      } else {
        console.warn(`[onError:${errorId}] Cannot save error - no sessionId`);
      }
      console.error(`[onError:${errorId}] ===== ON ERROR CALLBACK END =====`);
    },
  });

  // Derived state for isLoading
  const isLoading = status === "submitted" || status === "streaming";

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const createSession = useCallback(
    async (title: string = "New Chat") => {
      try {
        const response = await fetch("/api/chat/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });
        const data = await response.json();
        if (data.success) {
          await fetchSessions();
          setCurrentSessionId(data.data.id);
          setMessages([]);
          return data.data;
        }
      } catch (error) {
        console.error("Error creating session:", error);
      }
    },
    [fetchSessions, setMessages]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/chat/sessions/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          await fetchSessions();
          if (currentSessionId === id) {
            setCurrentSessionId(undefined);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    },
    [currentSessionId, fetchSessions, setMessages]
  );

  const loadSession = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/chat/sessions/${id}`);
        const data = await response.json();
        if (data.success) {
          const sessionMessages: UIMessage[] = data.data.map(
            (msg: { id: string; type: string; content: string }) => ({
              id: msg.id,
              role: msg.type === "user" ? "user" : "assistant",
              parts: [
                {
                  type: "text",
                  text: msg.content,
                },
              ],
            })
          );
          setMessages(sessionMessages);
          setCurrentSessionId(id);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      }
    },
    [setMessages]
  );

  // Store loadSession in ref so it can be accessed in onFinish
  useEffect(() => {
    loadSessionRef.current = loadSession;
  }, [loadSession]);

  const sendMessage = useCallback(
    async (content: string) => {
      let sessionToUse = currentSessionId;

      if (!sessionToUse) {
        const newSession = await createSession();
        if (newSession) {
          sessionToUse = newSession.id;
          setCurrentSessionId(sessionToUse);
        } else {
          return;
        }
      }

      // Save user message to database
      try {
        await fetch("/api/chat/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionToUse,
            type: "user",
            content,
          }),
        });
      } catch (error) {
        console.error("Error saving user message:", error);
      }

      // Clear input immediately after sending
      setInput("");

      // Use AI SDK's sendMessage method
      await aiSendMessage({
        text: content,
      });
    },
    [currentSessionId, createSession, aiSendMessage]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      if (input.trim() && !isLoading) {
        sendMessage(input.trim());
        setInput("");
      }
    },
    [input, isLoading, sendMessage]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Load session messages when sessionId changes
  useEffect(() => {
    if (currentSessionId) {
      loadSession(currentSessionId).catch((error) => {
        console.error("Error loading session in effect:", error);
      });
    } else {
      // Clear messages when no session is selected
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentSessionId,
    loadSession, // Clear messages when no session is selected
    setMessages,
  ]); // Intentionally excluding loadSession and setMessages to prevent infinite loops

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    sendMessage,
    isLoading,
    error,
    sessions,
    currentSessionId,
    isLoadingSessions,
    createSession,
    deleteSession,
    loadSession,
    reload: regenerate,
    stop,
  };
};
