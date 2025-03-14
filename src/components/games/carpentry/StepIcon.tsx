
import React from "react";
import { LucideIcon } from "lucide-react";
import { CarpentryStep } from "@/data/carpentrySteps";

interface StepIconProps {
  step: CarpentryStep;
}

export const StepIcon = ({ step }: StepIconProps) => {
  const IconComponent = step.icon as LucideIcon;
  return <IconComponent className="w-5 h-5 text-primary" />;
};
