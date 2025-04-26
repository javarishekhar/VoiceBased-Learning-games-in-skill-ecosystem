
import { Mic, MicOff, AlertTriangle } from "lucide-react";
import { useVoice } from "@/contexts/VoiceContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function VoiceIndicator() {
  const { isListening, confidence, startListening, stopListening, error } = useVoice();
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    if (isListening) {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [isListening]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handleClick}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 cursor-pointer",
                error 
                  ? "bg-red-500 hover:bg-red-600" 
                  : isListening
                    ? "bg-secondary animate-pulse"
                    : "bg-gray-200 hover:bg-gray-300"
              )}
            >
              {error ? (
                <AlertTriangle className="w-6 h-6 text-white" />
              ) : isListening ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-gray-600" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {error ? error : isListening ? "Currently listening" : "Click to enable voice input"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isListening && confidence > 0 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded">
          {Math.round(confidence * 100)}%
        </div>
      )}
    </div>
  );
}
