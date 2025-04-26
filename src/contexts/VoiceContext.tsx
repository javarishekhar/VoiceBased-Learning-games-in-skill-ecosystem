
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNetworkStatus } from "@/hooks/use-network-status";

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  confidence: number;
  clearTranscript: () => void;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const { online } = useNetworkStatus();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        // Initialize recognition but don't start yet
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          console.log("Voice recognition started");
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript;
          const confidence = event.results[last][0].confidence;
          console.log("Transcript:", transcript, "Confidence:", confidence);
          setTranscript(transcript);
          setConfidence(confidence);
          setError(null);
        };

        recognition.onerror = (event: any) => {
          console.error("Voice recognition error:", event.error);
          let errorMessage = "Unknown voice recognition error";
          
          switch(event.error) {
            case 'no-speech':
              errorMessage = "No speech was detected. Please try again.";
              break;
            case 'aborted':
              errorMessage = "Voice input was aborted.";
              break;
            case 'audio-capture':
              errorMessage = "Microphone not detected or permission denied.";
              break;
            case 'network':
              errorMessage = "Network error occurred. Check your connection.";
              break;
            case 'not-allowed':
              errorMessage = "Microphone permission was denied.";
              break;
            case 'service-not-allowed':
              errorMessage = "Speech recognition service not allowed.";
              break;
            default:
              errorMessage = `Error: ${event.error}. Please try again.`;
          }
          
          setError(errorMessage);
          
          toast({
            title: "Voice Recognition Error",
            description: errorMessage,
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
        setError("Your browser doesn't support speech recognition");
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

  useEffect(() => {
    if (!online && isListening) {
      stopListening();
      setError("Network connection lost. Voice recognition requires internet connection.");
      toast({
        title: "Network Error",
        description: "Internet connection required for voice recognition.",
        variant: "destructive",
      });
    }
  }, [online, isListening, toast]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        // If there's a previous session, make sure it's fully stopped
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log("No active recognition to stop", e);
        }
        
        // Reset recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = "en-US";
          
          // Reattach event handlers
          recognitionRef.current.onstart = () => {
            console.log("Voice recognition started");
            setIsListening(true);
            setError(null);
          };
          
          recognitionRef.current.onresult = (event: any) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript;
            const confidence = event.results[last][0].confidence;
            console.log("Transcript:", transcript, "Confidence:", confidence);
            setTranscript(transcript);
            setConfidence(confidence);
            setError(null);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error("Voice recognition error:", event.error);
            let errorMessage = "Unknown voice recognition error";
            
            switch(event.error) {
              case 'no-speech':
                errorMessage = "No speech was detected. Please try again.";
                break;
              case 'aborted':
                errorMessage = "Voice input was aborted.";
                break;
              case 'audio-capture':
                errorMessage = "Microphone not detected or permission denied.";
                break;
              case 'network':
                errorMessage = "Network error occurred. Check your connection.";
                break;
              case 'not-allowed':
                errorMessage = "Microphone permission was denied.";
                break;
              case 'service-not-allowed':
                errorMessage = "Speech recognition service not allowed.";
                break;
              default:
                errorMessage = `Error: ${event.error}. Please try again.`;
            }
            
            setError(errorMessage);
            
            toast({
              title: "Voice Recognition Error",
              description: errorMessage,
              variant: "destructive",
            });
            
            setIsListening(false);
          };
          
          recognitionRef.current.onend = () => {
            console.log("Voice recognition ended");
            setIsListening(false);
          };
        }
        
        // Clear previous transcript and error
        setTranscript("");
        setError(null);
        
        // Check for network connectivity before starting
        if (!online) {
          setError("Network connection required for voice recognition.");
          toast({
            title: "Network Error",
            description: "Internet connection required for voice recognition.",
            variant: "destructive",
          });
          return;
        }
        
        // Start new session
        recognitionRef.current.start();
        console.log("Starting voice recognition");
      } catch (error) {
        console.error("Error starting recognition:", error);
        // If there's an error, ensure state is correct
        setIsListening(false);
        setError("Failed to start voice recognition. Please try again.");
        toast({
          title: "Recognition Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setError("Speech recognition not available");
    }
  }, [online, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log("Stopping voice recognition");
      } catch (error) {
        console.error("Error stopping recognition:", error);
        setError("Error stopping voice recognition");
      }
      // Immediately update UI state, don't wait for onend
      setIsListening(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
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
        error
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
