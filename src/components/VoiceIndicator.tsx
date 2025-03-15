import { Mic, MicOff } from "lucide-react";
import { useVoice } from "@/contexts/VoiceContext";
import { cn } from "@/lib/utils";

export function VoiceIndicator() {
  const { isListening, confidence } = useVoice();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200",
          isListening
            ? "bg-secondary animate-pulse"
            : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
        )}
      >
        {isListening ? (
          <Mic className="w-6 h-6 text-white" />
        ) : (
          <MicOff className="w-6 h-6 text-gray-600" />
        )}
      </div>
      {isListening && confidence > 0 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded">
          {Math.round(confidence * 100)}%
        </div>
      )}
    </div>
  );
}