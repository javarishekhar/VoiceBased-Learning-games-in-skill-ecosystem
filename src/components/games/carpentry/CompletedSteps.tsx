
import React from "react";

interface CompletedStepsProps {
  completed: string[];
}

export const CompletedSteps = ({ completed }: CompletedStepsProps) => {
  return (
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
  );
};
