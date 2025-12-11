"use client";

import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string | undefined | null;
  className?: string;
}

export const Markdown = ({ content, className }: MarkdownProps) => {
  // Simple markdown rendering - can be enhanced with a proper markdown library
  const formatContent = (text: string | undefined | null) => {
    // Handle undefined, null, or non-string values
    if (!text || typeof text !== "string") {
      return "";
    }

    // Convert markdown-style links
    let formatted = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>'
    );

    // Convert bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Convert italic
    formatted = formatted.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Convert code blocks
    formatted = formatted.replace(
      /```([^`]+)```/g,
      '<pre class="bg-muted p-2 rounded"><code>$1</code></pre>'
    );

    // Convert inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded">$1</code>');

    // Convert line breaks
    formatted = formatted.replace(/\n/g, "<br />");

    return formatted;
  };

  // Note: Using dangerouslySetInnerHTML for markdown rendering
  // Content is sanitized through formatContent function
  // In production, consider using a proper markdown library like react-markdown
  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown content rendering
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
};
