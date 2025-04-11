
import React from "react";
import { voiceCommandsImage } from "./carpentryData";

interface GameHeaderProps {
  setShowVoiceHelp: (show: boolean) => void;
}

export function GameHeader({ setShowVoiceHelp }: GameHeaderProps) {
  return (
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
  );
}
