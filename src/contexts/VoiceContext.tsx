
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  confidence: number;
  clearTranscript: () => void;
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
  const recognitionRef = useRef<any>(null);

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

        recognitionRef.current = recognition;
      } else {
        toast({
          title: "Browser Not Supported",
          description: "Voice recognition is not supported in your browser.",
          variant: "destructive",
        });
      }
    }

    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping recognition on unmount:", error);
        }
      }
    };
  }, [toast]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        // First ensure any ongoing session is aborted
        if (isListening) {
          recognitionRef.current.abort();
        }
        
        // Clear previous transcript
        setTranscript("");
        
        // Start new session
        recognitionRef.current.start();
        console.log("Starting voice recognition");
      } catch (error) {
        console.error("Error starting recognition:", error);
        // If there's an error, ensure state is correct
        setIsListening(false);
        toast({
          title: "Recognition Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [isListening, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log("Stopping voice recognition");
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
      // Immediately update UI state, don't wait for onend
      setIsListening(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        startListening,
        stopListening,
        confidence,
        clearTranscript,
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
