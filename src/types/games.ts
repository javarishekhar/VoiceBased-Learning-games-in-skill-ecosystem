
import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";

export interface GameInfo {
  id: string;
  title: string;
  component: ComponentType;
  image: string;
  description: string;
  instructions: string;
  icon: LucideIcon;
}
