
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { carpentrySteps, voiceCommandsImage } from "./carpentry/carpentryData";
import { VoiceCommandsHelp } from "./carpentry/VoiceCommandsHelp";
import { StepAnimation } from "./carpentry/StepAnimation";
import { CompletedSteps } from "./carpentry/CompletedSteps";
import { CongratsScreen } from "./carpentry/CongratsScreen";

export function CarpentryGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing carpentry command:", command);
      
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
      } else if (command.includes("help") || command.includes("voice commands")) {
        stopListening();
        setShowVoiceHelp(true);
        setTimeout(() => {
          setShowVoiceHelp(false);
        }, 6000);
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
      <h2 className="text-2xl font-bold mb-4">Carpentry Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Say the step name to complete it</li>
              <li>• "What tools do I need?"</li>
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
            {currentStep < carpentrySteps.length ? carpentrySteps[currentStep].name : "All steps completed!"}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {currentStep < carpentrySteps.length ? carpentrySteps[currentStep].details : "Great job!"}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showAnimation && (
          <StepAnimation 
            showAnimation={showAnimation} 
            currentStep={carpentrySteps[currentStep]} 
          />
        )}

        <VoiceCommandsHelp 
          showVoiceHelp={showVoiceHelp} 
          setShowVoiceHelp={setShowVoiceHelp} 
        />
      </AnimatePresence>

      <CompletedSteps completed={completed} />

      <Button
        onClick={() => (isListening ? stopListening() : startListening())}
        className={isListening ? "bg-secondary" : "bg-primary"}
      >
        {isListening ? "Stop Listening" : "Start Speaking"}
      </Button>

      {isListening && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-sm text-gray-600"
        >
          Listening... Say a command!
        </motion.p>
      )}
      
      {transcript && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-2 text-sm text-gray-600"
        >
          Heard: {transcript}
        </motion.p>
      )}

      {/* Sound effect for completion */}
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3" />
    </Card>
  );
}
