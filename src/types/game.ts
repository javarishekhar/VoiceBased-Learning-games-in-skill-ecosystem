
import { FC, ComponentType } from "react";
import { LucideIcon } from "lucide-react";

export interface GameType {
  id: string;
  title: string;
  component: ComponentType<any>;
  image: string;
  description: string;
  instructions: string;
  icon: LucideIcon;
  category: string;
}
