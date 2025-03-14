import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Hammer, Ruler, Scissors, Tool, PaintBucket, Cylinder } from "lucide-react";

// Define the carpentry steps based on the requested flow
const carpentrySteps = [
  {
    id: "blueprint",
    name: "Read Blueprint",
    details: "View and understand the blueprint before starting",
    tools: ["blueprint", "glasses"],
    command: "show me the blueprint",
    icon: Cylinder,
    animation: "blueprint"
  },
  {
    id: "measure",
    name: "Measure Wood",
    details: "Use a measuring tape to get accurate dimensions",
    tools: ["measuring tape", "pencil"],
    command: "measure 10 inches",
    icon: Ruler,
    animation: "measure"
  },
  {
    id: "cut",
    name: "Cut Wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"],
    command: "cut the wood",
    icon: Scissors,
    animation: "cut"
  },
  {
    id: "shape",
    name: "Shape Edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"],
    command: "smooth the edges",
    icon: Tool,
    animation: "shape"
  },
  {
    id: "drill",
    name: "Drill Holes",
    details: "Drill holes for screws or nails",
    tools: ["drill", "drill bits"],
    command: "drill the holes",
    icon: Tool,
    animation: "drill"
  },
  {
    id: "assemble",
    name: "Assemble Parts",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"],
    command: "assemble the parts",
    icon: Tool,
    animation: "assemble"
  },
  {
    id: "secure",
    name: "Secure with Nails",
    details: "Hammer in nails to secure the assembly",
    tools: ["hammer", "nails"],
    command: "hammer the nails",
    icon: Hammer,
    animation: "hammer"
  },
  {
    id: "finish",
    name: "Apply Finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"],
    command: "apply polish",
    icon: PaintBucket,
    animation: "polish"
  }
];

// Animation component
const Animation = ({ animation, isPlaying }) => {
  const [frame, setFrame] = useState(0);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (isPlaying) {
      let frameCount = 0;
      
      const animate = () => {
        frameCount++;
        if (frameCount <= 60) {  // Run for 60 frames (~1 second at 60fps)
          setFrame(frameCount);
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying]);
  
  // Each animation has a different color and transformation
  const getAnimationStyle = () => {
    const intensity = Math.min(frame / 30, 1);
    
    switch (animation) {
      case "blueprint":
        return {
          backgroundColor: `rgba(100, 149, 237, ${intensity * 0.7})`,
          transform: `scale(${1 + intensity * 0.2})`,
        };
      case "measure":
        return {
          backgroundColor: `rgba(255, 222, 173, ${intensity * 0.7})`,
          transform: `scaleX(${1 + intensity * 0.5})`,
        };
      case "cut":
        return {
          backgroundColor: `rgba(240, 128, 128, ${intensity * 0.7})`,
          transform: `skewX(${intensity * 10}deg)`,
        };
      case "shape":
        return {
          backgroundColor: `rgba(222, 184, 135, ${intensity * 0.7})`,
          borderRadius: `${intensity * 20}%`,
        };
      case "drill":
        return {
          backgroundColor: `rgba(169, 169, 169, ${intensity * 0.7})`,
          transform: `rotate(${intensity * 360}deg)`,
        };
      case "assemble":
        return {
          backgroundColor: `rgba(144, 238, 144, ${intensity * 0.7})`,
          transform: `translate(${intensity * 10}px, ${-intensity * 10}px)`,
        };
      case "hammer":
        return {
          backgroundColor: `rgba(210, 180, 140, ${intensity * 0.7})`,
          transform: `translateY(${Math.sin(frame * 0.3) * 10}px)`,
        };
      case "polish":
        return {
          backgroundColor: `rgba(255, 215, 0, ${intensity * 0.7})`,
          boxShadow: `0 0 ${intensity * 20}px rgba(255, 215, 0, ${intensity})`,
        };
      default:
        return {};
    }
  };
  
  return (
    <div className="relative w-full h-32 flex items-center justify-center overflow-hidden rounded-lg mb-4">
      <div
        className="absolute w-16 h-16 transition-all duration-100"
        style={getAnimationStyle()}
      ></div>
      <div className="absolute top-2 left-2 text-xs text-gray-600">
        {animation ? animation.charAt(0).toUpperCase() + animation.slice(1) : ""}
      </div>
    </div>
  );
};

export function CarpentryGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("");
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing carpentry command:", command);
      
      // Check for step-specific command
      const currentStepCommand = carpentrySteps[currentStep].command.toLowerCase();
      const currentStepName = carpentrySteps[currentStep].name.toLowerCase();
      
      if (command.includes(currentStepCommand) || 
          command.includes(currentStepName) || 
          command.includes("next") || 
          command.includes("complete step")) {
        
        stopListening();
        
        // Play animation for the current step
        setCurrentAnimation(carpentrySteps[currentStep].animation);
        setIsAnimationPlaying(true);
        
        // Reset animation after 2 seconds
        setTimeout(() => {
          setIsAnimationPlaying(false);
          
          // Mark step as completed and move to next step
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
        }, 2000);
      } else if (command.includes("what tools") || command.includes("tools needed")) {
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
      } else if (command.includes("help") || command.includes("what should i say")) {
        stopListening();
        setDisplayPrompt(`Try saying: "${carpentrySteps[currentStep].command}"`);
        setTimeout(() => setDisplayPrompt(""), 5000);
      }
    }
  }, [transcript, currentStep, isListening, stopListening, toast]);

  // Fixed the JSX issue by properly using the Card component
  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Carpentry Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Say "<span className="text-primary">{carpentrySteps[currentStep].command}</span>" to complete the current step</li>
          <li>• "What tools do I need?"</li>
          <li>• "Explain the details"</li>
          <li>• "What should I say?" for help</li>
        </ul>
      </div>

      {/* Animation area */}
      <Animation 
        animation={currentAnimation} 
        isPlaying={isAnimationPlaying} 
      />

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Step</h3>
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            {currentStep < carpentrySteps.length && 
              <carpentrySteps[currentStep].icon className="w-5 h-5 text-primary" />}
            <p className="text-xl text-primary font-medium">
              {currentStep < carpentrySteps.length ? carpentrySteps[currentStep].name : "All steps completed!"}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {currentStep < carpentrySteps.length ? carpentrySteps[currentStep].details : "Great job!"}
          </p>
          {displayPrompt && (
            <p className="text-sm text-blue-600 mt-2 animate-pulse">
              {displayPrompt}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Completed Steps</h3>
        {completed.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No steps completed yet. Start with "Show me the blueprint"</p>
        ) : (
          <ul className="space-y-2">
            {completed.map((step, index) => (
              <li key={index} className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                {step}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={isListening ? "bg-secondary" : "bg-primary"}
        >
          {isListening ? "Stop Listening" : "Start Speaking"}
        </Button>

        <Button 
          variant="outline" 
          onClick={() => {
            setDisplayPrompt(`Try saying: "${carpentrySteps[currentStep].command}"`);
            setTimeout(() => setDisplayPrompt(""), 5000);
          }}
        >
          Show Hint
        </Button>
      </div>

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
    </div>
  );
}
