
import React from "react";
import { CarpentryStep } from "./carpentryData";

interface CurrentStepProps {
  currentStep: number;
  carpentrySteps: CarpentryStep[];
}

export function CurrentStep({ currentStep, carpentrySteps }: CurrentStepProps) {
  return (
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
  );
}
