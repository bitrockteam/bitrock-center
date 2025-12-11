import { getChatConfig } from "@/lib/chat/config";
import { getSystemPrompt } from "@/lib/chat/prompts";
import { getProvider } from "@/lib/chat/providers";
import { createClient, getUserInfoFromCookie } from "@/utils/supabase/server";
import { generateText, streamText } from "ai";

export const maxDuration = 30;

// Extract SQL query from LLM response
const extractSQLQuery = (text: string): string | null => {
  // Look for SQL code blocks
  const sqlBlockRegex = /```sql\s*([\s\S]*?)```/i;
  const match = text.match(sqlBlockRegex);
  if (match?.[1]) {
    return match[1]?.trim() ?? "";
  }

  // Look for SQL without code blocks (just SELECT statements)
  const selectRegex = /^\s*SELECT[\s\S]*?;?\s*$/i;
  if (selectRegex.test(text.trim())) {
    return text.trim().replace(/;+$/, "");
  }

  return null;
};

// Validate SQL query is safe (only SELECT)
const validateSQLQuery = (sql: string): { valid: boolean; error?: string } => {
  const trimmed = sql.trim().toUpperCase();

  // Check if it starts with SELECT
  if (!trimmed.startsWith("SELECT")) {
    return { valid: false, error: "Only SELECT queries are allowed" };
  }

  // Block dangerous keywords
  const dangerousKeywords = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "CREATE",
    "TRUNCATE",
    "EXEC",
    "EXECUTE",
    "CALL",
    "GRANT",
    "REVOKE",
  ];

  for (const keyword of dangerousKeywords) {
    if (trimmed.includes(keyword)) {
      return {
        valid: false,
        error: `Query contains forbidden keyword: ${keyword}`,
      };
    }
  }

  return { valid: true };
};

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] ===== CHAT REQUEST START =====`);
  console.log(`[${requestId}] Request headers:`, {
    contentType: request.headers.get("content-type"),
    accept: request.headers.get("accept"),
  });

  try {
    console.log(`[${requestId}] Step 1: Authenticating user...`);
    const userInfo = await getUserInfoFromCookie();
    if (!userInfo) {
      console.error(`[${requestId}] Authentication failed`);
      return new Response("Unauthorized", { status: 401 });
    }
    console.log(`[${requestId}] User authenticated:`, {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
    });

    let body: { messages?: unknown; sessionId?: string };
    try {
      console.log(`[${requestId}] Step 2: Parsing request body...`);
      body = await request.json();
      console.log(`[${requestId}] Request body parsed:`, {
        hasMessages: !!body.messages,
        hasSessionId: !!body.sessionId,
        sessionId: body.sessionId,
      });
    } catch (parseError) {
      console.error(`[${requestId}] Error parsing request body:`, parseError);
      return new Response("Invalid JSON in request body", { status: 400 });
    }

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error(`[${requestId}] Invalid messages:`, {
        messages,
        type: typeof messages,
        isArray: Array.isArray(messages),
      });
      return new Response("Invalid request: messages array required", {
        status: 400,
      });
    }

    console.log(`[${requestId}] Step 3: Processing ${messages.length} messages...`);

    console.log(`[${requestId}] Step 4: Initializing model and system prompt...`);
    const config = getChatConfig();
    const model = getProvider();
    const systemPrompt = getSystemPrompt(userInfo);
    console.log(`[${requestId}] Model and prompt initialized`);

    // Transform messages from UIMessage format (with parts) to standard format (with content)
    console.log(`[${requestId}] Step 5: Transforming messages...`);
    const transformedMessages = messages
      .map(
        (
          msg: {
            role: string;
            content?: string;
            parts?: Array<{ type: string; text?: string }>;
          },
          index: number
        ) => {
          // If message has parts (UIMessage format), extract text content
          if (msg.parts && Array.isArray(msg.parts)) {
            const textContent = msg.parts
              .filter((part) => part.type === "text")
              .map((part) => part.text || "")
              .join("");
            console.log(
              `[${requestId}] Message ${index}: Extracted from parts (${textContent.length} chars)`
            );
            return {
              role: msg.role as "user" | "assistant" | "system",
              content: textContent,
            };
          }
          // If message has content directly, use it
          if (msg.content) {
            console.log(
              `[${requestId}] Message ${index}: Using direct content (${msg.content.length} chars)`
            );
            return {
              role: msg.role as "user" | "assistant" | "system",
              content: msg.content,
            };
          }
          // Fallback: return empty content
          console.warn(`[${requestId}] Message ${index}: No content found, using empty string`);
          return {
            role: msg.role as "user" | "assistant" | "system",
            content: "",
          };
        }
      )
      .filter((msg) => msg.content && msg.content.trim().length > 0);

    console.log(`[${requestId}] Transformed ${transformedMessages.length} valid messages`);

    if (transformedMessages.length === 0) {
      console.error(`[${requestId}] No valid messages after transformation`);
      return new Response("No valid messages found", { status: 400 });
    }

    // Get the last user message
    const lastMessage = transformedMessages[transformedMessages.length - 1];
    const isUserMessage = lastMessage.role === "user";
    console.log(`[${requestId}] Last message is ${lastMessage.role}:`, {
      contentPreview: lastMessage.content.substring(0, 100),
      isUserMessage,
    });

    if (isUserMessage) {
      // Step 1: Generate SQL query from user input
      console.log(`[${requestId}] Step 6: Generating SQL query from user input...`);
      const sqlGenerationStart = Date.now();
      const sqlGenerationResult = await generateText({
        model,
        system: systemPrompt,
        messages: transformedMessages,
        temperature: config.temperature,
      });
      const sqlGenerationTime = Date.now() - sqlGenerationStart;
      console.log(`[${requestId}] SQL generation completed in ${sqlGenerationTime}ms`);
      console.log(`[${requestId}] Generated text (${sqlGenerationResult.text.length} chars):`, {
        preview: sqlGenerationResult.text.substring(0, 200),
      });

      console.log(`[${requestId}] Step 7: Extracting SQL query...`);
      const sqlQuery = extractSQLQuery(sqlGenerationResult.text);

      if (!sqlQuery) {
        // No SQL query found, treat as general conversation
        console.log(`[${requestId}] No SQL query found, treating as general conversation`);
        console.log(`[${requestId}] Step 8: Streaming general conversation response...`);
        const result = await streamText({
          model,
          system: systemPrompt,
          messages: transformedMessages,
          temperature: config.temperature,
        });
        console.log(`[${requestId}] ===== CHAT REQUEST END (general conversation) =====`);
        return result.toUIMessageStreamResponse();
      }

      console.log(`[${requestId}] SQL query extracted:`, sqlQuery);

      // Step 2: Validate SQL query
      console.log(`[${requestId}] Step 8: Validating SQL query...`);
      const validation = validateSQLQuery(sqlQuery);
      if (!validation.valid) {
        const errorMessage = `Invalid SQL query: ${validation.error}`;
        console.error(`[${requestId}] SQL validation failed:`, errorMessage);
        console.log(`[${requestId}] Step 9: Streaming validation error response...`);
        const result = await streamText({
          model,
          system: systemPrompt,
          messages: [
            ...transformedMessages,
            {
              role: "assistant" as const,
              content: `I generated this SQL query:\n\`\`\`sql\n${sqlQuery}\n\`\`\`\n\nHowever, there was an error: ${errorMessage}`,
            },
          ],
          temperature: config.temperature,
        });
        console.log(`[${requestId}] ===== CHAT REQUEST END (validation error) =====`);
        return result.toUIMessageStreamResponse();
      }
      console.log(`[${requestId}] SQL query validated successfully`);

      // Step 3: Execute SQL query
      console.log(`[${requestId}] Step 9: Executing SQL query...`);
      const supabase = await createClient();
      let queryResults: unknown[] = [];
      let queryError: string | null = null;

      try {
        const executionStart = Date.now();
        // Use the execute_sql RPC function if available, otherwise use direct query
        const { data, error } = await supabase.rpc("execute_sql", {
          sql: sqlQuery,
        });
        const executionTime = Date.now() - executionStart;

        if (error) {
          queryError = error.message;
          console.error(`[${requestId}] SQL execution failed (${executionTime}ms):`, error);
        } else {
          queryResults = (data as unknown[]) || [];
          console.log(`[${requestId}] SQL execution successful (${executionTime}ms):`, {
            rowCount: queryResults.length,
            firstRowPreview: queryResults[0]
              ? JSON.stringify(queryResults[0]).substring(0, 200)
              : null,
          });
        }
      } catch (error) {
        queryError = error instanceof Error ? error.message : "Unknown error executing query";
        console.error(`[${requestId}] SQL execution exception:`, error);
      }

      // Step 4: Format results through LLM
      console.log(`[${requestId}] Step 10: Formatting results through LLM...`);
      const resultsContext = queryError
        ? `SQL Query executed with error:\n\`\`\`sql\n${sqlQuery}\n\`\`\`\n\nError: ${queryError}`
        : `SQL Query executed successfully:\n\`\`\`sql\n${sqlQuery}\n\`\`\`\n\nResults (${
            queryResults.length
          } rows):\n\`\`\`json\n${JSON.stringify(
            queryResults,
            null,
            2
          )}\n\`\`\`\n\nPlease format these results in natural language for the user.`;

      const formattingMessages = [
        ...transformedMessages,
        {
          role: "assistant" as const,
          content: `I generated this SQL query:\n\`\`\`sql\n${sqlQuery}\n\`\`\`\n\n${resultsContext}`,
        },
      ];

      const formattingStart = Date.now();
      console.log(`[${requestId}] Calling streamText with messages:`, {
        messageCount: formattingMessages.length,
        lastMessagePreview: formattingMessages[formattingMessages.length - 1]?.content?.substring(
          0,
          200
        ),
      });

      const result = await streamText({
        model,
        system: `${systemPrompt}\n\nWhen formatting query results, be concise, user-friendly, and highlight key information. If there are errors, explain them clearly.`,
        messages: formattingMessages,
        temperature: config.temperature,
      });
      const formattingTime = Date.now() - formattingStart;

      console.log(`[${requestId}] Response formatting completed (${formattingTime}ms)`);
      console.log(`[${requestId}] Stream result:`, {
        hasStream: !!result,
        hasTextStream: !!result.toTextStreamResponse,
      });

      console.log(`[${requestId}] Step 11: Streaming formatted response to client...`);
      console.log(`[${requestId}] ===== CHAT REQUEST END (success) =====`);

      // Use toUIMessageStreamResponse() instead of toTextStreamResponse()
      // This ensures DefaultChatTransport can properly parse it and trigger onFinish
      const streamResponse = result.toUIMessageStreamResponse();
      console.log(`[${requestId}] Stream response created:`, {
        hasBody: !!streamResponse.body,
        headers: Object.fromEntries(streamResponse.headers.entries()),
      });

      return streamResponse;
    }

    // For non-user messages or follow-up, just stream normally
    console.log(`[${requestId}] Step 6: Streaming follow-up response...`);
    const result = await streamText({
      model,
      system: systemPrompt,
      messages: transformedMessages,
      temperature: config.temperature,
    });
    console.log(`[${requestId}] ===== CHAT REQUEST END (follow-up) =====`);
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(`[${requestId}] ===== CHAT REQUEST ERROR =====`);
    console.error(`[${requestId}] Error in chat API:`, error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error(`[${requestId}] Error details:`, {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return a streamed error response so it can be saved via onFinish
    console.log(`[${requestId}] Step ERROR: Streaming error response...`);
    const model = getProvider();
    const errorResponse = await streamText({
      model,
      system: "You are a helpful assistant. When errors occur, explain them clearly to the user.",
      messages: [
        {
          role: "user" as const,
          content: `An error occurred: ${errorMessage}. Please explain this error to the user in a friendly way.`,
        },
      ],
    });
    console.log(`[${requestId}] ===== CHAT REQUEST END (error streamed) =====`);
    return errorResponse.toUIMessageStreamResponse();
  }
}
