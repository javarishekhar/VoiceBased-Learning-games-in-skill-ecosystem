
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { carpentrySteps } from "./carpentryData";

interface StepProcessorReturn {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  completed: string[];
  setCompleted: React.Dispatch<React.SetStateAction<string[]>>;
  showAnimation: boolean;
  setShowAnimation: React.Dispatch<React.SetStateAction<boolean>>;
  gameCompleted: boolean;
  setGameCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  audioRef: React.RefObject<HTMLAudioElement>;
  processVoiceCommand: (command: string, stopListening: () => void) => void;
  voiceCommandError: string | null;
  setVoiceCommandError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useStepProcessor(): StepProcessorReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [voiceCommandError, setVoiceCommandError] = useState<string | null>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const processVoiceCommand = (command: string, stopListening: () => void) => {
    // Reset any previous errors
    setVoiceCommandError(null);
    
    if (!command || command.trim() === "") {
      setVoiceCommandError("No command detected. Please try speaking more clearly.");
      return;
    }
    
    command = command.toLowerCase().trim();
    const currentStepLower = carpentrySteps[currentStep].name.toLowerCase();
    
    if (command.includes(currentStepLower) || 
        command.includes("next step") || 
        command.includes("complete step")) {
      stopListening();
      setShowAnimation(true);
      
      // Play sound effect for step completion
      if (audioRef.current) {
        audioRef.current.play();
      }
      
      // Show animation for 3 seconds then proceed
      setTimeout(() => {
        setShowAnimation(false);
        setCompleted(prev => [...prev, carpentrySteps[currentStep].name]);
        
        if (currentStep < carpentrySteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          toast({
            title: "Step Completed",
            description: "Good job! Moving to next step.",
            variant: "default",
          });
        } else {
          setGameCompleted(true);
          toast({
            title: "Project Completed",
            description: "You've completed all carpentry steps!",
            variant: "default",
          });
        }
      }, 3000);
    } else if (command.includes("what tools")) {
      stopListening();
      toast({
        title: "Required Tools",
        description: carpentrySteps[currentStep].tools.join(", "),
        variant: "default",
      });
    } else if (command.includes("details") || command.includes("explain")) {
      stopListening();
      toast({
        title: "Step Details",
        description: carpentrySteps[currentStep].details,
        variant: "default",
      });
    } else {
      setVoiceCommandError(`Command not recognized: "${command}". Try saying "next step" or the step name.`);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    completed,
    setCompleted,
    showAnimation,
    setShowAnimation,
    gameCompleted,
    setGameCompleted,
    audioRef,
    processVoiceCommand,
    voiceCommandError,
    setVoiceCommandError
  };
}
