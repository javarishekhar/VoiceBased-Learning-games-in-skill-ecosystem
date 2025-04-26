
import { useEffect, useState } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Card } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { carpentrySteps } from "./carpentry/carpentryData";
import { VoiceCommandsHelp } from "./carpentry/VoiceCommandsHelp";
import { StepAnimation } from "./carpentry/StepAnimation";
import { CompletedSteps } from "./carpentry/CompletedSteps";
import { CongratsScreen } from "./carpentry/CongratsScreen";
import { GameHeader } from "./carpentry/GameHeader";
import { CurrentStep } from "./carpentry/CurrentStep";
import { VoiceControl } from "./carpentry/VoiceControl";
import { useStepProcessor } from "./carpentry/useStepProcessor";

export function CarpentryGame() {
  const { transcript, isListening, startListening, stopListening, error } = useVoice();
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  
  const {
    currentStep,
    completed,
    showAnimation,
    gameCompleted,
    setGameCompleted,
    audioRef,
    processVoiceCommand,
    setCurrentStep,
    setCompleted,
    voiceCommandError,
    setVoiceCommandError
  } = useStepProcessor();

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing carpentry command:", command);
      
      if (command.includes("help") || command.includes("voice commands")) {
        stopListening();
        setShowVoiceHelp(true);
        setTimeout(() => {
          setShowVoiceHelp(false);
        }, 6000);
        return;
      }
      
      processVoiceCommand(command, stopListening);
    }
  }, [transcript, currentStep, isListening, stopListening, processVoiceCommand]);

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
      
      <GameHeader setShowVoiceHelp={setShowVoiceHelp} />
      <CurrentStep currentStep={currentStep} carpentrySteps={carpentrySteps} />

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
