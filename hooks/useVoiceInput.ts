"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export type VoiceMode = "web-speech" | "whisper";

const STORAGE_KEY_WHISPER_ENABLED = "chat_whisper_enabled";
const MAX_RECORDING_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useVoiceInput = (onTranscript: (text: string, isFinal: boolean) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMode, setCurrentMode] = useState<VoiceMode>("web-speech");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingMimeTypeRef = useRef<string>("audio/webm");
  const recordingFileExtensionRef = useRef<string>("webm");

  // Check if Speech Recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  // Load Whisper preference from localStorage
  useEffect(() => {
    const whisperEnabled = localStorage.getItem(STORAGE_KEY_WHISPER_ENABLED);
    if (whisperEnabled === "true") {
      setCurrentMode("whisper");
    }
  }, []);

  const getSpeechRecognitionErrorMessage = useCallback((error: string): string => {
    switch (error) {
      case "not-allowed":
        return "Microphone permission denied. Please enable microphone access in your browser settings.";
      case "no-speech":
        return "No speech detected. Please try again.";
      case "audio-capture":
        return "No microphone found. Please connect a microphone.";
      case "network":
        return "Network error. Please check your connection.";
      default:
        return `Speech recognition error: ${error}`;
    }
  }, []);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (!isSupported || currentMode !== "web-speech") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += `${transcript} `;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        onTranscript(interimTranscript, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setError(getSpeechRecognitionErrorMessage(event.error));
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported, currentMode, onTranscript, getSpeechRecognitionErrorMessage]);

  const startWebSpeechRecording = useCallback(async () => {
    if (!recognitionRef.current || isRecording) return;

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsRecording(false);
      setError("Failed to start speech recognition");
    }
  }, [isRecording]);

  const startWhisperRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder - prioritize formats that Whisper API supports well
      // Whisper API has issues with WebM files using Opus codec, so prioritize MP4
      let mimeType: string | undefined;
      let fileExtension = "webm";

      // Check for supported types in order of preference
      // Try MP4 first (best compatibility with Whisper)
      if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
        fileExtension = "mp4";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        // WebM might use Opus codec which Whisper doesn't support well
        // But it's the only option, so we'll try it
        mimeType = "audio/webm";
        fileExtension = "webm";
      }
      // If no type is specified, browser will use default (usually webm with opus)

      // Store for later use
      recordingMimeTypeRef.current = mimeType || "audio/webm";
      recordingFileExtensionRef.current = fileExtension;

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      // Log the actual MIME type being used for debugging
      console.log("MediaRecorder MIME type:", mediaRecorder.mimeType);

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        setError(null);

        try {
          // Use the stored MIME type, fallback to MediaRecorder's mimeType
          const blobMimeType =
            recordingMimeTypeRef.current || mediaRecorder.mimeType || "audio/webm";
          const audioBlob = new Blob(audioChunksRef.current, {
            type: blobMimeType,
          });

          // Send to Whisper API
          const formData = new FormData();
          // Use appropriate file extension based on MIME type
          const fileName = `recording.${recordingFileExtensionRef.current}`;
          formData.append("audio", audioBlob, fileName);

          const response = await fetch("/api/chat/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = errorData.error || "Failed to transcribe audio";

            // Provide helpful error message for codec issues
            if (
              errorMessage.includes("could not be decoded") ||
              errorMessage.includes("format is not supported")
            ) {
              errorMessage =
                "Audio format not supported by Whisper API. Your browser may be recording in a format that's incompatible. Try using a different browser or enable MP4 audio recording support.";
            }

            throw new Error(errorMessage);
          }

          const data = await response.json();
          if (data.success && data.text) {
            onTranscript(data.text, true);
          } else {
            throw new Error("No transcription returned");
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Failed to transcribe audio";
          setError(errorMessage);
          console.error("Whisper transcription error:", err);
        } finally {
          setIsProcessing(false);
          audioChunksRef.current = [];
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setError(null);

      // Auto-stop after max duration
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
          streamRef.current = null;
        }
        setIsRecording(false);
      }, MAX_RECORDING_DURATION);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to access microphone";
      setError(errorMessage);
      setIsRecording(false);
      console.error("Error starting Whisper recording:", err);
    }
  }, [onTranscript]);

  const stopRecording = useCallback(() => {
    if (currentMode === "web-speech") {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    } else if (currentMode === "whisper") {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsRecording(false);
  }, [currentMode, isRecording]);

  const startRecording = useCallback(
    (mode: VoiceMode) => {
      setCurrentMode(mode);
      if (mode === "web-speech") {
        startWebSpeechRecording();
      } else {
        startWhisperRecording();
      }
    },
    [startWebSpeechRecording, startWhisperRecording]
  );

  const setWhisperMode = useCallback((enabled: boolean) => {
    setCurrentMode(enabled ? "whisper" : "web-speech");
    localStorage.setItem(STORAGE_KEY_WHISPER_ENABLED, enabled ? "true" : "false");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRecording]);

  return {
    isRecording,
    isProcessing,
    isSupported,
    currentMode,
    error,
    startRecording,
    stopRecording,
    setWhisperMode,
    clearError: () => setError(null),
  };
};
