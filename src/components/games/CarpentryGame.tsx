import React, { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Hammer, Ruler, Scissors, PaintBucket, Cylinder, Wrench, Drill } from "lucide-react";

const carpentrySteps = [
  {
    id: "blueprint",
    name: "Read Blueprint",
    details: "View and understand the blueprint before starting",
    tools: ["blueprint", "glasses"],
    command: "show me the blueprint",
    icon: Cylinder,
    animation: "blueprint",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/532/original/blueprint-scrolling-looping.mp4"
  },
  {
    id: "measure",
    name: "Measure Wood",
    details: "Use a measuring tape to get accurate dimensions",
    tools: ["measuring tape", "pencil"],
    command: "measure 10 inches",
    icon: Ruler,
    animation: "measure",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/046/504/original/P1030768.mp4"
  },
  {
    id: "cut",
    name: "Cut Wood",
    details: "Carefully cut along the marked lines",
    tools: ["saw", "clamps"],
    command: "cut the wood",
    icon: Scissors,
    animation: "cut",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/038/640/original/carpenter-sawing-wood-plank.mp4"
  },
  {
    id: "shape",
    name: "Shape Edges",
    details: "Smooth all cut edges with sandpaper",
    tools: ["sandpaper", "sanding block"],
    command: "smooth the edges",
    icon: Ruler,
    animation: "shape",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/046/138/original/P1030397.mp4"
  },
  {
    id: "drill",
    name: "Drill Holes",
    details: "Drill holes for screws or nails",
    tools: ["drill", "drill bits"],
    command: "drill the holes",
    icon: Drill,
    animation: "drill",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/010/original/drill-a-hole.mp4"
  },
  {
    id: "assemble",
    name: "Assemble Parts",
    details: "Join the pieces according to the plan",
    tools: ["screwdriver", "screws", "wood glue"],
    command: "assemble the parts",
    icon: Wrench,
    animation: "assemble",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/034/076/original/wood-work-building.mp4"
  },
  {
    id: "secure",
    name: "Secure with Nails",
    details: "Hammer in nails to secure the assembly",
    tools: ["hammer", "nails"],
    command: "hammer the nails",
    icon: Hammer,
    animation: "hammer",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/035/106/original/carpenter-hammering-a-nail-on-a-plank.mp4"
  },
  {
    id: "finish",
    name: "Apply Finish",
    details: "Apply your chosen finish for protection",
    tools: ["finish", "brush", "cloth"],
    command: "apply polish",
    icon: PaintBucket,
    animation: "polish",
    videoUrl: "https://static.videezy.com/system/resources/previews/000/038/703/original/painting-wooden-planks.mp4"
  }
];

const Animation = ({ animation, isPlaying, videoUrl }) => {
  const videoRef = useRef(null);
  const [showParticles, setShowParticles] = useState(false);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setShowParticles(true);
      
      const timer = setTimeout(() => {
        setShowParticles(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (!showParticles || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 1,
        color: getAnimationColor(animation),
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5
      });
    }
    
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showParticles, animation]);
  
  const getAnimationColor = (animationType) => {
    const colors = {
      blueprint: 'rgba(100, 149, 237, 0.7)',
      measure: 'rgba(255, 222, 173, 0.7)',
      cut: 'rgba(240, 128, 128, 0.7)',
      shape: 'rgba(222, 184, 135, 0.7)',
      drill: 'rgba(169, 169, 169, 0.7)',
      assemble: 'rgba(144, 238, 144, 0.7)',
      hammer: 'rgba(210, 180, 140, 0.7)',
      polish: 'rgba(255, 215, 0, 0.7)'
    };
    
    return colors[animationType] || 'rgba(200, 200, 200, 0.7)';
  };
  
  return (
    <div className="relative w-full h-72 flex items-center justify-center overflow-hidden rounded-lg mb-4 bg-gray-100">
      {videoUrl && (
        <video 
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
        />
      )}
      
      {showParticles && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        />
      )}
      
      <div className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded z-20">
        {animation ? animation.charAt(0).toUpperCase() + animation.slice(1) : ""}
      </div>
      
      {isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-primary text-white text-lg font-bold px-4 py-2 rounded-full animate-bounce">
            {animation?.toUpperCase()}
          </div>
        </div>
      )}
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
      
      const currentStepCommand = carpentrySteps[currentStep].command.toLowerCase();
      const currentStepName = carpentrySteps[currentStep].name.toLowerCase();
      
      if (command.includes(currentStepCommand) || 
          command.includes(currentStepName) || 
          command.includes("next") || 
          command.includes("complete step")) {
        
        stopListening();
        
        setCurrentAnimation(carpentrySteps[currentStep].animation);
        setIsAnimationPlaying(true);
        
        setTimeout(() => {
          setIsAnimationPlaying(false);
          
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
              variant: "default"
            });
          }
        }, 3000);
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

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10 bg-gradient-to-br from-white to-blue-50 shadow-xl border-0">
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Carpentry Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600 bg-white/60 p-3 rounded-lg">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Say "<span className="text-primary font-medium">{carpentrySteps[currentStep].command}</span>" to complete the current step
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            "What tools do I need?"
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            "Explain the details"
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            "What should I say?" for help
          </li>
        </ul>
      </div>

      <Animation 
        animation={currentAnimation || carpentrySteps[currentStep]?.animation} 
        isPlaying={isAnimationPlaying} 
        videoUrl={carpentrySteps[currentStep]?.videoUrl}
      />

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Step</h3>
        <div className="bg-primary/5 p-4 rounded-lg transform transition-all hover:scale-[1.01] border border-primary/10">
          <div className="flex items-center gap-2">
            {currentStep < carpentrySteps.length && 
              React.createElement(carpentrySteps[currentStep].icon, { className: "w-5 h-5 text-primary" })}
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
        <div className="bg-white/60 rounded-lg p-2">
          {completed.length === 0 ? (
            <p className="text-sm text-gray-500 italic p-2">No steps completed yet. Start with "Show me the blueprint"</p>
          ) : (
            <ul className="space-y-1">
              {completed.map((step, index) => (
                <li key={index} className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-md">
                  <span className="mr-2 flex-shrink-0">✓</span>
                  {step}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={`${isListening ? "bg-secondary" : "bg-primary"} relative overflow-hidden group`}
        >
          <span className="relative z-10">
            {isListening ? "Stop Listening" : "Start Speaking"}
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
          <span className={`absolute inset-0 ${isListening ? 'bg-green-600' : 'bg-blue-600'} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => {
            setDisplayPrompt(`Try saying: "${carpentrySteps[currentStep].command}"`);
            setTimeout(() => setDisplayPrompt(""), 5000);
          }}
          className="group relative"
        >
          <span>Show Hint</span>
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
        </Button>
      </div>

      {isListening && (
        <div className="text-center mt-4 text-sm">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <p>Listening... Say a command!</p>
          </div>
        </div>
      )}
      
      {transcript && (
        <p className="text-center mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
          Heard: <span className="font-medium">{transcript}</span>
        </p>
      )}
    </Card>
  );
}
