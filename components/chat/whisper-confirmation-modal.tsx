"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface WhisperConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const WhisperConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
}: WhisperConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <DialogTitle>Enable Premium Voice Transcription</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Switch to OpenAI Whisper API for higher accuracy voice transcription.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Pricing</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>$0.006 per minute of audio</li>
              <li>Example: 1 hour of audio = $0.36</li>
              <li>Charged only when you use Whisper mode</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Higher accuracy than free Web Speech API</li>
              <li>Better handling of accents and background noise</li>
              <li>Consistent quality across all browsers</li>
            </ul>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> You can switch back to free Web Speech API at any time using
              the settings toggle.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Enable Whisper API</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
