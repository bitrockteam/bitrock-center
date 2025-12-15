import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { logErrorSummary, getErrorSummary } from "@/lib/utils";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // Authenticate user
    const userInfo = await getUserInfoFromCookie();
    if (!userInfo) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return Response.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Validate file type (handle MIME types with codec parameters like "audio/webm;codecs=opus")
    const allowedBaseTypes = [
      "audio/webm",
      "audio/mp3",
      "audio/mpeg",
      "audio/mp4",
      "audio/wav",
      "audio/x-m4a",
      "audio/ogg",
    ];

    // Extract base MIME type (remove codec parameters)
    const baseMimeType = audioFile.type.split(";")[0].trim();
    const isAllowed = allowedBaseTypes.includes(baseMimeType);

    if (!isAllowed) {
      return Response.json(
        {
          error: `Unsupported audio format: ${
            audioFile.type
          }. Supported formats: ${allowedBaseTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file size (25MB limit for Whisper API)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (audioFile.size > maxSize) {
      return Response.json(
        {
          error: `File too large. Maximum size is 25MB, got ${(
            audioFile.size / 1024 / 1024
          ).toFixed(2)}MB`,
        },
        { status: 400 }
      );
    }

    // Get OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logErrorSummary("transcribe-api-key", new Error("OPENAI_API_KEY is not set"));
      return Response.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    // Convert File to FormData for OpenAI API
    const openaiFormData = new FormData();

    // If the file is webm with opus codec, Whisper might reject it
    // Try to work around by ensuring proper file extension
    // baseMimeType is already defined above, reuse it
    let fileName = audioFile.name || "recording.webm";

    // Ensure file extension matches MIME type for better compatibility
    if (baseMimeType === "audio/webm" && !fileName.endsWith(".webm")) {
      fileName = fileName.replace(/\.[^.]+$/, "") + ".webm";
    } else if (baseMimeType === "audio/mp4" && !fileName.endsWith(".mp4")) {
      fileName = fileName.replace(/\.[^.]+$/, "") + ".mp4";
    }

    // Create a new File with the correct name and type
    const fileToSend = new File([audioFile], fileName, { type: baseMimeType });

    openaiFormData.append("file", fileToSend);
    openaiFormData.append("model", "whisper-1");
    openaiFormData.append("language", "en"); // Optional: specify language for better accuracy

    // Call OpenAI Whisper API
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: openaiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      logErrorSummary(
        "whisper-api",
        new Error(errorData.error?.message || "OpenAI Whisper API error")
      );
      return Response.json(
        { error: errorData.error?.message || "Failed to transcribe audio" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.text) {
      return Response.json({ error: "No transcription returned from API" }, { status: 500 });
    }

    return Response.json({ success: true, text: data.text });
  } catch (error) {
    logErrorSummary("transcribe-route", error);
    const summary = getErrorSummary(error);
    return Response.json({ error: summary.message }, { status: 500 });
  }
}
