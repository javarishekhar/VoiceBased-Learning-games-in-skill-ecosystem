
import { BookOpen, Code, Hammer, Heart } from "lucide-react";
import { QuizGame } from "@/components/games/QuizGame";
import CodingGame from "@/components/games/CodingGame";
import { CarpentryGame } from "@/components/games/CarpentryGame";
import { FirstAidGame } from "@/components/games/FirstAidGame";

export interface Game {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  image: string;
  description: string;
  instructions: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const games = [
  { 
    id: "quiz", 
    title: "Knowledge Quiz", 
    component: QuizGame,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    description: "Test your knowledge with voice-controlled questions",
    instructions: "Welcome to the Knowledge Quiz! To play this game, listen to each question carefully and speak your answer clearly. Choose from the provided options by saying the answer out loud. The game will tell you if you're correct or incorrect and keep track of your score.",
    icon: BookOpen
  },
  { 
    id: "coding", 
    title: "Voice Coding", 
    component: CodingGame,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    description: "Learn coding through voice commands",
    instructions: "Welcome to Voice Coding! You can create variables by saying 'create variable name equal to value', create functions by saying 'create function name', and print to console by saying 'print' followed by your message. Use the Run Code button to execute your code.",
    icon: Code
  },
  { 
    id: "carpentry", 
    title: "Carpentry Training", 
    component: CarpentryGame,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    description: "Master carpentry skills step by step",
    instructions: "Welcome to Carpentry Training! Complete each step by saying the step name or 'next step'. You can ask 'what tools do I need' to learn about required tools, or say 'explain details' to get more information about the current step.",
    icon: Hammer
  },
  { 
    id: "firstaid", 
    title: "First Aid Training", 
    component: FirstAidGame,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    description: "Learn life-saving first aid procedures",
    instructions: "Welcome to First Aid Training! Follow each step carefully by saying the step name or 'next step'. You can ask 'what equipment do I need' to check required equipment, or say 'explain details' to get more information about the current step.",
    icon: Heart
  },
];
