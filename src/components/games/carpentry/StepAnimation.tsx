
import { motion } from "framer-motion";
import { CarpentryStep } from "./carpentryData";

interface StepAnimationProps {
  showAnimation: boolean;
  currentStep: CarpentryStep;
}

export function StepAnimation({ showAnimation, currentStep }: StepAnimationProps) {
  if (!showAnimation) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="mb-6 rounded-lg overflow-hidden shadow-lg"
    >
      <div className="relative pt-[56.25%] bg-white">
        <img 
          src={currentStep.animation} 
          alt={currentStep.alt}
          className="absolute top-0 left-0 w-full h-full object-contain" 
        />
      </div>
      <div className="p-4 bg-primary text-white text-center">
        <p>Performing: {currentStep.name}</p>
      </div>
    </motion.div>
  );
}
