
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  confidence: number;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const { toast } = useToast();
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          console.log("Voice recognition started");
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript;
          const confidence = event.results[last][0].confidence;
          console.log("Transcript:", transcript, "Confidence:", confidence);
          setTranscript(transcript);
          setConfidence(confidence);
        };

        recognition.onerror = (event: any) => {
          console.error("Voice recognition error:", event.error);
          toast({
            title: "Voice Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          });
          setIsListening(false);
        };

        recognition.onend = () => {
          console.log("Voice recognition ended");
          setIsListening(false);
        };

        setRecognition(recognition);
      } else {
        toast({
          title: "Browser Not Supported",
          description: "Voice recognition is not supported in your browser.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      console.log("Starting voice recognition");
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      console.log("Stopping voice recognition");
      // Immediately update UI state even before the onend event fires
      setIsListening(false);
    }
  }, [recognition]);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        startListening,
        stopListening,
        confidence,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
}
