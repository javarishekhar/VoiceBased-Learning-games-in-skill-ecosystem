import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const firstAidSteps = [
  {
    name: "Check the scene",
    details: "Ensure the area is safe for you and the victim",
    equipment: ["gloves", "mask"]
  },
  {
    name: "Call emergency services",
    details: "Dial emergency number and provide location and situation",
    equipment: ["phone"]
  },
  {
    name: "Check breathing",
    details: "Look, listen, and feel for breathing",
    equipment: ["none"]
  },
  {
    name: "Control bleeding",
    details: "Apply direct pressure to wounds",
    equipment: ["bandages", "gauze", "gloves"]
  },
  {
    name: "Treat for shock",
    details: "Keep patient warm and elevate legs if possible",
    equipment: ["blanket"]
  },
  {
    name: "Monitor vital signs",
    details: "Check pulse, breathing, and consciousness regularly",
    equipment: ["watch", "notepad"]
  }
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
      
      const currentStepLower = firstAidSteps[currentStep].name.toLowerCase();
      if (command.includes(currentStepLower) || 
          command.includes("next step") || 
          command.includes("complete step")) {
        stopListening();
        setCompleted(prev => [...prev, firstAidSteps[currentStep].name]);
        
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
      } else if (command.includes("what equipment") || command.includes("what do i need")) {
        stopListening();
        toast({
          title: "Required Equipment",
          description: firstAidSteps[currentStep].equipment.join(", "),
        });
      } else if (command.includes("details") || command.includes("explain")) {
        stopListening();
        toast({
          title: "Step Details",
          description: firstAidSteps[currentStep].details,
        });
      }
    }
  }, [transcript, currentStep, isListening, stopListening, toast]);

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">First Aid Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Say the step name to complete it</li>
          <li>• "What equipment do I need?"</li>
          <li>• "Explain the details"</li>
          <li>• "Next step" or "Complete step"</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Step</h3>
        <div className="bg-primary/5 p-4 rounded-lg">
          <p className="text-xl text-primary font-medium">
            {currentStep < firstAidSteps.length ? firstAidSteps[currentStep].name : "All steps completed!"}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {currentStep < firstAidSteps.length ? firstAidSteps[currentStep].details : "Great job!"}
          </p>
        </div>
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
          Listening... Say a command!
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