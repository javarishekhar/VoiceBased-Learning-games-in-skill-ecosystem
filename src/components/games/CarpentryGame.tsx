
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
    animation: "https://images.unsplash.com/photo-1567361808960-dec9cb578182?q=80&w=500",
    alt: "Person measuring wood with a tape measure"
  },
  {
    name: "Mark cutting lines",
    details: "Use a straight edge and pencil to mark your cuts",
    tools: ["pencil", "straight edge", "square"],
    animation: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=500",
    alt: "Marking cutting lines on wood"
  },
  {
    name: "Cut the wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"],
    animation: "https://images.unsplash.com/photo-1572372786078-b1bf1cb82356?q=80&w=500",
    alt: "Cutting wood with a saw"
  },
  {
    name: "Sand the edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"],
    animation: "https://images.unsplash.com/photo-1580893246395-52aead8960dc?q=80&w=500",
    alt: "Sanding wood edges"
  },
  {
    name: "Assemble pieces",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"],
    animation: "https://images.unsplash.com/photo-1598544962610-e04587e9c627?q=80&w=500",
    alt: "Assembling wooden pieces"
  },
  {
    name: "Apply finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"],
    animation: "https://images.unsplash.com/photo-1541850364054-9f8883060f5c?q=80&w=500",
    alt: "Applying finish to wood"
  }
];

export function CarpentryGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
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
  );
}
