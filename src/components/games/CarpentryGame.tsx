import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const carpentrySteps = [
  {
    name: "Measure the wood",
    details: "Use a measuring tape to get accurate dimensions",
    tools: ["measuring tape", "pencil"]
  },
  {
    name: "Mark cutting lines",
    details: "Use a straight edge and pencil to mark your cuts",
    tools: ["pencil", "straight edge", "square"]
  },
  {
    name: "Cut the wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"]
  },
  {
    name: "Sand the edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"]
  },
  {
    name: "Assemble pieces",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"]
  },
  {
    name: "Apply finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"]
  }
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
      
      const currentStepLower = carpentrySteps[currentStep].name.toLowerCase();
      if (command.includes(currentStepLower) || 
          command.includes("next step") || 
          command.includes("complete step")) {
        stopListening();
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
      } else if (command.includes("what tools")) {
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
      }
    }
  }, [transcript, currentStep, isListening, stopListening, toast]);

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Carpentry Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Say the step name to complete it</li>
          <li>• "What tools do I need?"</li>
          <li>• "Explain the details"</li>
          <li>• "Next step" or "Complete step"</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Step</h3>
        <div className="bg-primary/5 p-4 rounded-lg">
          <p className="text-xl text-primary font-medium">
            {currentStep < carpentrySteps.length ? carpentrySteps[currentStep].name : "All steps completed!"}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {currentStep < carpentrySteps.length ? carpentrySteps[currentStep].details : "Great job!"}
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