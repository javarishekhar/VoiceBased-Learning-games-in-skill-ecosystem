
import React from "react";
import { StepIcon } from "./StepIcon";
import { CarpentryStep } from "@/data/carpentrySteps";

interface CurrentStepProps {
  currentStep: number;
  carpentrySteps: CarpentryStep[];
  displayPrompt: string;
}

export const CurrentStep = ({ currentStep, carpentrySteps, displayPrompt }: CurrentStepProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Current Step</h3>
      <div className="bg-primary/5 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          {currentStep < carpentrySteps.length && 
            <StepIcon step={carpentrySteps[currentStep]} />}
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
  );
};
