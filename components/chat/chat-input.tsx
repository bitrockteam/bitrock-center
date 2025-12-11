"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import type { FormEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSend,
  isLoading = false,
  disabled = false,
}: ChatInputProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim() && !isLoading && !disabled) {
      onSend(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading && !disabled) {
        onSend(value.trim());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Input
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={isLoading || disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || disabled || !value.trim()} size="icon">
        <Send className="size-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
};
