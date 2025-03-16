
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const carpentrySteps = [
  {
    name: "Measure the wood",
    details: "Use a measuring tape to get accurate dimensions",
    tools: ["measuring tape", "pencil"],
    animation: "/lovable-uploads/3533d798-6ecd-4840-8d7f-03eab519abae.png",
    alt: "Person measuring wood with a tape measure"
  },
  {
    name: "Mark cutting lines",
    details: "Use a straight edge and pencil to mark your cuts",
    tools: ["pencil", "straight edge", "square"],
    animation: "/lovable-uploads/70b909c8-7da9-4f15-9154-b47ce62e8412.png",
    alt: "Marking cutting lines on wood"
  },
  {
    name: "Cut the wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"],
    animation: "/lovable-uploads/a8ab20ca-9a89-46d9-bf40-7e5cd72588fa.png",
    alt: "Cutting wood with a saw"
  },
  {
    name: "Sand the edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"],
    animation: "/lovable-uploads/3533d798-6ecd-4840-8d7f-03eab519abae.png",
    alt: "Sanding wood edges"
  },
  {
    name: "Assemble pieces",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"],
    animation: "/lovable-uploads/70b909c8-7da9-4f15-9154-b47ce62e8412.png",
    alt: "Assembling wooden pieces"
  },
  {
    name: "Apply finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"],
    animation: "/lovable-uploads/a8ab20ca-9a89-46d9-bf40-7e5cd72588fa.png",
    alt: "Applying finish to wood"
  }
];

// Voice commands illustration image
const voiceCommandsImage = "/lovable-uploads/3533d798-6ecd-4840-8d7f-03eab519abae.png";

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

  return (
    <>
      {!gameCompleted ? (
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
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-6 rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src={carpentrySteps[currentStep].animation} 
                  alt={carpentrySteps[currentStep].alt}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-primary text-white text-center">
                  <p>Performing: {carpentrySteps[currentStep].name}</p>
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
                      <p className="font-bold text-primary">"Measure the wood"</p>
                      <p className="text-sm">Complete the current step</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="font-bold text-primary">"Next step"</p>
                      <p className="text-sm">Move to the next step</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="font-bold text-primary">"What tools do I need?"</p>
                      <p className="text-sm">Get required tools list</p>
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
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
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
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-primary/30 rounded-lg transform -rotate-1"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-xl">
                <p className="text-2xl md:text-3xl text-gray-800 mb-4">
                  You have completed the game and learned new carpentry skills through your voice commands!
                </p>
                <p className="text-xl text-accent">Happy Learning!</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex justify-center space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <img
                src="/lovable-uploads/3533d798-6ecd-4840-8d7f-03eab519abae.png"
                alt="Carpentry skills"
                className="w-24 h-24 object-cover rounded-full border-4 border-secondary shadow-lg"
              />
              <img
                src="/lovable-uploads/70b909c8-7da9-4f15-9154-b47ce62e8412.png"
                alt="Carpentry skills"
                className="w-24 h-24 object-cover rounded-full border-4 border-primary shadow-lg"
              />
              <img
                src="/lovable-uploads/a8ab20ca-9a89-46d9-bf40-7e5cd72588fa.png"
                alt="Carpentry skills"
                className="w-24 h-24 object-cover rounded-full border-4 border-accent shadow-lg"
              />
            </motion.div>
            <Button 
              className="mt-8 bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90"
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
