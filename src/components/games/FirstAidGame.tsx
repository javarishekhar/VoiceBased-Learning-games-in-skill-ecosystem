
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const firstAidSteps = [
  {
    name: "Check the scene",
    details: "Ensure the area is safe for you and the victim",
    equipment: ["gloves", "mask"],
    animation: "/lovable-uploads/6f552ea6-7cfe-4e7c-bf82-c03a5e264121.png",
    alt: "Person checking the scene at an accident"
  },
  {
    name: "Call emergency services",
    details: "Dial emergency number and provide location and situation",
    equipment: ["phone"],
    animation: "/lovable-uploads/a7e4566d-c0fb-49f6-836c-d32c54f62356.png",
    alt: "Calling emergency services with ambulance"
  },
  {
    name: "Check breathing",
    details: "Look, listen, and feel for breathing",
    equipment: ["none"],
    animation: "/lovable-uploads/b4557cb3-305b-4621-b50d-e6d45f262676.png",
    alt: "Checking breathing of injured person"
  },
  {
    name: "Control bleeding",
    details: "Apply direct pressure to wounds",
    equipment: ["bandages", "gauze", "gloves"],
    animation: "/lovable-uploads/654bba0c-ea62-40b4-9994-f6b6f3254ca7.png",
    alt: "Controlling bleeding with pressure and bandages"
  },
  {
    name: "Treat for shock",
    details: "Keep patient warm and elevate legs if possible",
    equipment: ["blanket"],
    animation: "/lovable-uploads/4775dbcd-59eb-49ca-934a-3ab0da49d601.png",
    alt: "Treating patient for shock"
  },
  {
    name: "Monitor health condition",
    details: "Check pulse, breathing, and consciousness regularly",
    equipment: ["watch", "notepad"],
    animation: "/lovable-uploads/405dfeb1-1ee5-4881-a72e-999f41b63715.png",
    alt: "Monitoring vital signs with medical equipment"
  }
];

// Voice commands illustration image
const voiceCommandsImage = "/lovable-uploads/6f552ea6-7cfe-4e7c-bf82-c03a5e264121.png";

export function FirstAidGame() {
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
      console.log("Processing first aid command:", command);
      
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
      }
    }
  }, [transcript, currentStep, isListening, stopListening, toast]);

  return (
    <>
      {!gameCompleted ? (
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
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-6 rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src={firstAidSteps[currentStep].animation} 
                  alt={firstAidSteps[currentStep].alt}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-primary text-white text-center">
                  <p>Performing: {firstAidSteps[currentStep].name}</p>
                </div>
              </motion.div>
            )}

            {showVoiceHelp && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setShowVoiceHelp(false)}
              >
                <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold mb-4 text-center">Voice Commands</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="font-bold text-primary">"Check the scene"</p>
                      <p className="text-sm">Complete the current step</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="font-bold text-primary">"Next step"</p>
                      <p className="text-sm">Move to the next step</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="font-bold text-primary">"What equipment do I need?"</p>
                      <p className="text-sm">Get required equipment list</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="font-bold text-primary">"Explain details"</p>
                      <p className="text-sm">Get step explanation</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => setShowVoiceHelp(false)}
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Completed Steps</h3>
            <ul className="space-y-2">
              {completed.map((step, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-green-600"
                >
                  <span className="mr-2">✓</span>
                  {step}
                </motion.li>
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
      ) : (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-3xl"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Congratulations!
            </motion.h1>
            <motion.div
              className="mb-8 relative p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-300/30 to-blue-300/30 rounded-lg transform -rotate-1"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-xl">
                <p className="text-2xl md:text-3xl text-gray-800 mb-4">
                  You have completed the game and learned new first aid skills through your voice commands!
                </p>
                <p className="text-xl text-red-500">Happy Learning!</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex justify-center space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <img
                src="/lovable-uploads/6f552ea6-7cfe-4e7c-bf82-c03a5e264121.png"
                alt="First aid skills"
                className="w-24 h-24 object-cover rounded-full border-4 border-red-400 shadow-lg"
              />
              <img
                src="/lovable-uploads/a7e4566d-c0fb-49f6-836c-d32c54f62356.png"
                alt="First aid skills"
                className="w-24 h-24 object-cover rounded-full border-4 border-blue-400 shadow-lg"
              />
              <img
                src="/lovable-uploads/405dfeb1-1ee5-4881-a72e-999f41b63715.png"
                alt="First aid skills"
                className="w-24 h-24 object-cover rounded-full border-4 border-green-400 shadow-lg"
              />
            </motion.div>
            <Button 
              className="mt-8 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600"
              onClick={() => setGameCompleted(false)}
            >
              Start Again
            </Button>
          </motion.div>
        </div>
      )}
    </>
  );
}
