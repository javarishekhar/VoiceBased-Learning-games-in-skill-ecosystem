
import React from "react";
import { CarpentryStep } from "@/data/carpentrySteps";

interface VoiceCommandsProps {
  currentStepCommand: string;
}

export const VoiceCommands = ({ currentStepCommand }: VoiceCommandsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>• Say "<span className="text-primary">{currentStepCommand}</span>" to complete the current step</li>
        <li>• "What tools do I need?"</li>
        <li>• "Explain the details"</li>
        <li>• "What should I say?" for help</li>
      </ul>
    </div>
  );
};
