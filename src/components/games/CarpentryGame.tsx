import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const carpentrySteps = [
  "Measure the wood",
  "Mark cutting lines",
  "Cut the wood",
  "Sand the edges",
  "Assemble pieces",
  "Apply finish"
];

export function CarpentryGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing carpentry command:", command);
      
      const currentStepLower = carpentrySteps[currentStep].toLowerCase();
      if (command.includes(currentStepLower)) {
        stopListening();
        setCompleted(prev => [...prev, carpentrySteps[currentStep]]);
        
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
      }
    }
  }, [transcript, currentStep, isListening, stopListening, toast]);

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Carpentry Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Step</h3>
        <p className="text-xl text-primary">
          {currentStep < carpentrySteps.length ? carpentrySteps[currentStep] : "All steps completed!"}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Completed Steps</h3>
        <ul className="space-y-2">
          {completed.map((step, index) => (
            <li key={index} className="flex items-center text-green-600">
              <span className="mr-2">✓</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => (isListening ? stopListening() : startListening())}
        className={isListening ? "bg-secondary" : "bg-primary"}
      >
        {isListening ? "Stop Listening" : "Start Speaking"}
      </Button>

      {isListening && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Listening... Say the current step to complete it!
        </p>
      )}
      
      {transcript && (
        <p className="text-center mt-2 text-sm text-gray-600">
          Heard: {transcript}
        </p>
      )}
    </Card>
  );
}