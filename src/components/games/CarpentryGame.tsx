
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { carpentrySteps } from "@/data/carpentrySteps";
import { Animation } from "./carpentry/Animation";
import { CurrentStep } from "./carpentry/CurrentStep";
import { CompletedSteps } from "./carpentry/CompletedSteps";
import { VoiceCommands } from "./carpentry/VoiceCommands";

export function CarpentryGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("");
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing carpentry command:", command);
      
      // Check for step-specific command
      const currentStepCommand = carpentrySteps[currentStep].command.toLowerCase();
      const currentStepName = carpentrySteps[currentStep].name.toLowerCase();
      
      if (command.includes(currentStepCommand) || 
          command.includes(currentStepName) || 
          command.includes("next") || 
          command.includes("complete step")) {
        
        stopListening();
        
        // Play animation for the current step
        setCurrentAnimation(carpentrySteps[currentStep].animation);
        setIsAnimationPlaying(true);
        
        // Reset animation after 2 seconds
        setTimeout(() => {
          setIsAnimationPlaying(false);
          
          // Mark step as completed and move to next step
          setCompleted(prev => [...prev, carpentrySteps[currentStep].name]);
          
          if (currentStep < carpentrySteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            toast({
              title: "Step Completed",
              description: "Good job! Moving to next step.",
            });
          } else {
            toast({
              title: "Project Completed",
              description: "You've completed all carpentry steps!",
            });
          }
        }, 2000);
      } else if (command.includes("what tools") || command.includes("tools needed")) {
        stopListening();
        toast({
          title: "Required Tools",
          description: carpentrySteps[currentStep].tools.join(", "),
        });
      } else if (command.includes("details") || command.includes("explain")) {
        stopListening();
        toast({
          title: "Step Details",
          description: carpentrySteps[currentStep].details,
        });
      } else if (command.includes("help") || command.includes("what should i say")) {
        stopListening();
        setDisplayPrompt(`Try saying: "${carpentrySteps[currentStep].command}"`);
        setTimeout(() => setDisplayPrompt(""), 5000);
      }
    }
  }, [transcript, currentStep, isListening, stopListening, toast]);

  const handleHintClick = () => {
    setDisplayPrompt(`Try saying: "${carpentrySteps[currentStep].command}"`);
    setTimeout(() => setDisplayPrompt(""), 5000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Carpentry Training</h2>
      
      <VoiceCommands currentStepCommand={carpentrySteps[currentStep].command} />

      {/* Animation area */}
      <Animation 
        animation={currentAnimation} 
        isPlaying={isAnimationPlaying} 
      />

      <CurrentStep 
        currentStep={currentStep}
        carpentrySteps={carpentrySteps}
        displayPrompt={displayPrompt}
      />

      <CompletedSteps completed={completed} />

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={isListening ? "bg-secondary" : "bg-primary"}
        >
          {isListening ? "Stop Listening" : "Start Speaking"}
        </Button>

        <Button 
          variant="outline" 
          onClick={handleHintClick}
        >
          Show Hint
        </Button>
      </div>

      {isListening && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Listening... Say a command!
        </p>
      )}
      
      {transcript && (
        <p className="text-center mt-2 text-sm text-gray-600">
          Heard: {transcript}
        </p>
      )}
    </div>
  );
}
