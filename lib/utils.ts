import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts meaningful error information from an error object
 * Hides massive stack traces and provides a clean, summarized error
 */
export function getErrorSummary(error: unknown): {
  message: string;
  code?: string;
  meta?: Record<string, unknown>;
} {
  if (error instanceof Error) {
    // Handle Prisma errors - they have code and meta properties
    const prismaError = error as Error & {
      code?: string;
      meta?: Record<string, unknown>;
      clientVersion?: string;
    };

    // Extract clean message without stack trace
    let message = error.message || "An unknown error occurred";

    // Remove Prisma's verbose error details from message
    if (message.includes("Invalid `prisma.")) {
      message = message.split("\n")[0] || message;
    }

    // Remove stack traces and verbose details
    message = message.split("\n")[0].trim();

    const code = prismaError.code;
    const meta = prismaError.meta;

    // Extract meaningful Prisma error information
    if (code) {
      // Create a clean, user-friendly message
      const cleanMessage = message.replace(/^\s*Error:\s*/i, "").trim();
      return {
        message: `Database error (${code}): ${cleanMessage}`,
        code,
        meta: meta ? { ...meta } : undefined,
      };
    }

    return { message };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return { message: "An unknown error occurred" };
}

/**
 * Logs a summarized error instead of the full error object
 */
export function logErrorSummary(context: string, error: unknown): void {
  const summary = getErrorSummary(error);
  console.error(`[${context}] Error:`, {
    message: summary.message,
    code: summary.code,
    meta: summary.meta,
  });
}
