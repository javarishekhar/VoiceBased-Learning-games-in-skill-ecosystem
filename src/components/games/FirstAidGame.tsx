
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { firstAidSteps, voiceCommandsImage } from "./first-aid/firstAidData";
import { VoiceCommandsHelp } from "./first-aid/VoiceCommandsHelp";
import { StepAnimation } from "./first-aid/StepAnimation";
import { CongratsScreen } from "./first-aid/CongratsScreen";
import { CompletedSteps } from "./first-aid/CompletedSteps";
import { VoiceControl } from "./carpentry/VoiceControl";

export function FirstAidGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const { transcript, isListening, startListening, stopListening, error } = useVoice();
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [voiceCommandError, setVoiceCommandError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing first aid command:", command);
      
      // Reset any previous command errors
      setVoiceCommandError(null);
      
      const currentStepLower = firstAidSteps[currentStep].name.toLowerCase();
      if (command.includes(currentStepLower) || 
          command.includes("next step") || 
          command.includes("complete step") || 
          (currentStep === 5 && command.includes("monitor health"))) {
        stopListening();
        setShowAnimation(true);
        
        // Play sound effect for step completion
        if (audioRef.current) {
          audioRef.current.play();
        }
        
        // Show animation for 3 seconds then proceed
        setTimeout(() => {
          setShowAnimation(false);
          setCompleted(prev => [...prev, firstAidSteps[currentStep].name]);
          
          if (currentStep < firstAidSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            toast({
              title: "Step Completed",
              description: "Good job! Moving to next step.",
              variant: "default",
            });
          } else {
            setGameCompleted(true);
            toast({
              title: "Training Completed",
              description: "You've completed all first aid steps!",
              variant: "default",
            });
          }
        }, 3000);
      } else if (command.includes("what equipment") || command.includes("what do i need")) {
        stopListening();
        toast({
          title: "Required Equipment",
          description: firstAidSteps[currentStep].equipment.join(", "),
          variant: "default",
        });
      } else if (command.includes("details") || command.includes("explain")) {
        stopListening();
        toast({
          title: "Step Details",
          description: firstAidSteps[currentStep].details,
          variant: "default",
        });
      } else if (command.includes("help") || command.includes("voice commands")) {
        stopListening();
        setShowVoiceHelp(true);
        setTimeout(() => {
          setShowVoiceHelp(false);
        }, 6000);
      } else {
        setVoiceCommandError(`Command not recognized: "${command}". Try saying "next step" or the step name.`);
      }
    }
  }, [transcript, currentStep, isListening, stopListening, toast]);

  const resetGame = () => {
    setGameCompleted(false);
    setCurrentStep(0);
    setCompleted([]);
  };

  if (gameCompleted) {
    return <CongratsScreen resetGame={resetGame} />;
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">First Aid Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Say the step name to complete it</li>
              <li>• "What equipment do I need?"</li>
              <li>• "Explain the details"</li>
              <li>• "Next step" or "Complete step"</li>
              <li>• Say "Help" for voice commands</li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <img 
              src={voiceCommandsImage} 
              alt="Voice commands illustration" 
              className="rounded-lg shadow-md w-full h-auto object-cover"
              onClick={() => setShowVoiceHelp(true)}
            />
            <p className="text-xs text-center mt-1 text-gray-500">Click image for voice command help</p>
          </div>
        </div>
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

      <AnimatePresence>
        {showAnimation && (
          <StepAnimation 
            showAnimation={showAnimation} 
            currentStep={firstAidSteps[currentStep]} 
          />
        )}

        <VoiceCommandsHelp 
          showVoiceHelp={showVoiceHelp} 
          setShowVoiceHelp={setShowVoiceHelp} 
        />
      </AnimatePresence>

      <CompletedSteps completed={completed} />

      <VoiceControl
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
        transcript={transcript}
        error={error || voiceCommandError}
      />

      {/* Sound effect for completion */}
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3" />
    </Card>
  );
}
