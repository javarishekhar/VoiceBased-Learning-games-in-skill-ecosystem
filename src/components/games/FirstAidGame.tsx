import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const firstAidSteps = [
  "Check the scene",
  "Call emergency services",
  "Check breathing",
  "Control bleeding",
  "Treat for shock",
  "Monitor vital signs"
];

export function FirstAidGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing first aid command:", command);
      
      const currentStepLower = firstAidSteps[currentStep].toLowerCase();
      if (command.includes(currentStepLower)) {
        stopListening();
        setCompleted(prev => [...prev, firstAidSteps[currentStep]]);
        
        if (currentStep < firstAidSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          toast({
            title: "Step Completed",
            description: "Good job! Moving to next step.",
          });
        } else {
          toast({
            title: "Training Completed",
            description: "You've completed all first aid steps!",
          });
        }
      }
    }
  }, [transcript, currentStep, isListening, stopListening, toast]);

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">First Aid Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Step</h3>
        <p className="text-xl text-primary">
          {currentStep < firstAidSteps.length ? firstAidSteps[currentStep] : "All steps completed!"}
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