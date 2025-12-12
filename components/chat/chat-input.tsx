"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { Mic, MicOff, Send, Settings2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { WhisperConfirmationModal } from "./whisper-confirmation-modal";

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
  const [showWhisperModal, setShowWhisperModal] = useState(false);
  const [pendingModeSwitch, setPendingModeSwitch] = useState<"whisper" | null>(null);
  const [interimValue, setInterimValue] = useState("");

  const handleTranscript = (text: string, isFinal: boolean) => {
    if (isFinal) {
      // Final transcript: append to current value (excluding interim)
      const baseValue = value.replace(interimValue, "").trim();
      const newValue = baseValue ? `${baseValue} ${text}` : text;
      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
      setInterimValue("");
    } else {
      // Interim transcript: show temporarily
      setInterimValue(text);
    }
  };

  const {
    isRecording,
    isProcessing,
    isSupported,
    currentMode,
    error,
    startRecording,
    stopRecording,
    setWhisperMode,
    clearError,
  } = useVoiceInput(handleTranscript);

  // Display error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Update input display with interim results
  const displayValue = interimValue ? `${value} ${interimValue}` : value;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
    }
    if (value.trim() && !isLoading && !disabled) {
      onSend(value.trim());
      setInterimValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isRecording) {
        stopRecording();
      }
      if (value.trim() && !isLoading && !disabled) {
        onSend(value.trim());
        setInterimValue("");
      }
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording(currentMode);
    }
  };

  const handleWhisperConfirm = () => {
    setWhisperMode(true);
    if (pendingModeSwitch === "whisper") {
      startRecording("whisper");
      setPendingModeSwitch(null);
    }
  };

  const handleModeSwitch = (mode: "web-speech" | "whisper") => {
    if (isRecording) {
      stopRecording();
    }

    if (mode === "whisper" && currentMode !== "whisper") {
      // Check if user has already enabled Whisper
      const whisperEnabled = localStorage.getItem("chat_whisper_enabled") === "true";
      if (!whisperEnabled) {
        setPendingModeSwitch("whisper");
        setShowWhisperModal(true);
        return;
      }
    }

    setWhisperMode(mode === "whisper");
  };

  const isInputDisabled = isLoading || disabled || isProcessing;
  const canRecord = isSupported && !isInputDisabled;

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
        {canRecord && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant={isRecording ? "default" : "outline"}
              size="icon"
              onClick={handleMicClick}
              disabled={isInputDisabled}
              className={isRecording ? "animate-pulse" : ""}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isInputDisabled}
                  aria-label="Voice input settings"
                >
                  <Settings2 className="size-4" />
                  <span className="sr-only">Voice input settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleModeSwitch("web-speech")}
                  className={currentMode === "web-speech" ? "bg-accent" : ""}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Web Speech API</span>
                    <span className="text-xs text-muted-foreground">Free, real-time</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleModeSwitch("whisper")}
                  className={currentMode === "whisper" ? "bg-accent" : ""}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Whisper API</span>
                    <span className="text-xs text-muted-foreground">Premium, higher accuracy</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <Input
          value={displayValue}
          onChange={(e) => {
            // Clear interim value when user types manually
            if (interimValue) {
              setInterimValue("");
            }
            onChange(e);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isRecording
              ? currentMode === "whisper"
                ? "Recording... Click mic to stop"
                : "Listening... speak now"
              : isProcessing
                ? "Transcribing..."
                : "Type your message..."
          }
          disabled={isInputDisabled}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isInputDisabled || !value.trim()}
          size="icon"
          aria-label="Send message"
        >
          <Send className="size-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>

      <WhisperConfirmationModal
        open={showWhisperModal}
        onOpenChange={setShowWhisperModal}
        onConfirm={handleWhisperConfirm}
      />
    </>
  );
};
