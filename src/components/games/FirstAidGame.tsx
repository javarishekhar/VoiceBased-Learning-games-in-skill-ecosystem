
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, HeartPulse, Phone, ShieldCheck, Stethoscope, Thermometer, User } from "lucide-react";

const firstAidSteps = [
  {
    name: "Check the scene",
    details: "Ensure the area is safe for you and the victim",
    equipment: ["gloves", "mask"],
    icon: AlertCircle,
    videoUrl: "https://static.videezy.com/system/resources/previews/000/042/652/original/alerta2.mp4"
  },
  {
    name: "Call emergency services",
    details: "Dial emergency number and provide location and situation",
    equipment: ["phone"],
    icon: Phone,
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/494/original/typing-a-phone-number.mp4"
  },
  {
    name: "Check breathing",
    details: "Look, listen, and feel for breathing",
    equipment: ["none"],
    icon: HeartPulse,
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/548/original/Medical-doctor-stethoscope-physical-heart-health-care.mp4"
  },
  {
    name: "Control bleeding",
    details: "Apply direct pressure to wounds",
    equipment: ["bandages", "gauze", "gloves"],
    icon: Thermometer,
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/554/original/doctor-pulse.mp4"
  },
  {
    name: "Treat for shock",
    details: "Keep patient warm and elevate legs if possible",
    equipment: ["blanket"],
    icon: ShieldCheck,
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/535/original/ECG_1.mp4"
  },
  {
    name: "Monitor vital signs",
    details: "Check pulse, breathing, and consciousness regularly",
    equipment: ["watch", "notepad"],
    icon: Stethoscope,
    videoUrl: "https://static.videezy.com/system/resources/previews/000/044/617/original/heart-monitor.mp4"
  }
];

export function FirstAidGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
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
        setIsAnimating(true);
        
        setTimeout(() => {
          setIsAnimating(false);
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
              variant: "success"
            });
          }
        }, 2000);
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
    <Card className="p-6 max-w-2xl mx-auto mt-10 bg-gradient-to-br from-white to-red-50 shadow-xl border-0">
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-primary">First Aid Training</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600 bg-white/60 p-3 rounded-lg">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            Say "<span className="text-red-500 font-medium">{firstAidSteps[currentStep].name}</span>" to complete the step
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            "What equipment do I need?"
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            "Explain the details"
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            "Next step" or "Complete step"
          </li>
        </ul>
      </div>

      {/* Video demonstration area */}
      <div className="relative w-full h-64 flex items-center justify-center overflow-hidden rounded-lg mb-6 bg-gray-100">
        {currentStep < firstAidSteps.length && (
          <video 
            src={firstAidSteps[currentStep].videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay={isAnimating}
            loop
            muted
            playsInline
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Step {currentStep + 1}: {currentStep < firstAidSteps.length ? firstAidSteps[currentStep].name : "Complete"}
        </div>
        
        {!isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 rounded-full p-4">
              {currentStep < firstAidSteps.length && React.createElement(firstAidSteps[currentStep].icon, { 
                className: "w-10 h-10 text-red-500" 
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Step</h3>
        <div className="bg-red-500/5 p-4 rounded-lg transform transition-all hover:scale-[1.01] border border-red-100">
          <div className="flex items-center gap-2">
            {currentStep < firstAidSteps.length && React.createElement(firstAidSteps[currentStep].icon, { 
              className: "w-5 h-5 text-red-500" 
            })}
            <p className="text-xl text-red-500 font-medium">
              {currentStep < firstAidSteps.length ? firstAidSteps[currentStep].name : "All steps completed!"}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {currentStep < firstAidSteps.length ? firstAidSteps[currentStep].details : "Great job!"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Completed Steps</h3>
        <div className="bg-white/60 rounded-lg p-2">
          {completed.length === 0 ? (
            <p className="text-sm text-gray-500 italic p-2">No steps completed yet</p>
          ) : (
            <ul className="space-y-1">
              {completed.map((step, index) => (
                <li key={index} className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-md">
                  <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
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
          className={`${isListening ? "bg-secondary" : "bg-red-500"} relative overflow-hidden group`}
          disabled={isAnimating}
        >
          <span className="relative z-10">
            {isListening ? "Stop Listening" : "Start Speaking"}
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </Button>
      </div>

      {isListening && (
        <div className="text-center mt-4 text-sm">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
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
