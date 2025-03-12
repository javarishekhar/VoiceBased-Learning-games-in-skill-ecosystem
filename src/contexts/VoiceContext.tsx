
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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

    // Cleanup function to ensure recognition is stopped when component unmounts
    return () => {
      if (recognitionRef.current) {
        try {
          if (isListening) {
            recognitionRef.current.stop();
          }
        } catch (error) {
          console.error("Error stopping recognition during cleanup:", error);
        }
      }
    };
  }, [toast]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    // First check if already listening
    if (isListening) {
      console.log("Already listening, stopping first...");
      try {
        recognitionRef.current.stop();
        // Give a small delay before starting again
        setTimeout(() => {
          try {
            recognitionRef.current.start();
            console.log("Restarting voice recognition");
          } catch (error) {
            console.error("Error restarting recognition:", error);
          }
        }, 200);
      } catch (error) {
        console.error("Error stopping recognition before restart:", error);
      }
    } else {
      try {
        recognitionRef.current.start();
        console.log("Starting voice recognition");
      } catch (error) {
        console.error("Error starting recognition:", error);
        
        // If we get an error starting, make sure we reset the state
        setIsListening(false);
        
        // Try to abort the recognition session and start again
        try {
          recognitionRef.current.abort();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              console.log("Restarting voice recognition after abort");
            } catch (secondError) {
              console.error("Failed to restart recognition after abort:", secondError);
              toast({
                title: "Voice Recognition Failed",
                description: "Please refresh the page and try again.",
                variant: "destructive",
              });
            }
          }, 300);
        } catch (abortError) {
          console.error("Error aborting recognition:", abortError);
        }
      }
    }
  }, [isListening, toast]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      console.log("Stopping voice recognition");
      // Immediately update UI state even before the onend event fires
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping recognition:", error);
      
      // Still update the UI to reflect that we're not listening anymore
      setIsListening(false);
      
      // Try to abort the recognition session as a fallback
      try {
        recognitionRef.current.abort();
      } catch (abortError) {
        console.error("Error aborting recognition:", abortError);
      }
    }
  }, []);

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
