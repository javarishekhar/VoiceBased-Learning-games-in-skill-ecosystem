
import { motion } from "framer-motion";
import { FirstAidStep } from "./firstAidData";

interface StepAnimationProps {
  showAnimation: boolean;
  currentStep: FirstAidStep;
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
      <img 
        src={currentStep.animation} 
        alt={currentStep.alt}
        className="w-full h-64 object-contain bg-white" 
      />
      <div className="p-4 bg-primary text-white text-center">
        <p>Performing: {currentStep.name}</p>
      </div>
    </motion.div>
  );
}
