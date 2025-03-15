
import { QuizGame } from "@/components/games/QuizGame";
import { CodingGame } from "@/components/games/CodingGame";
import { CarpentryGame } from "@/components/games/CarpentryGame";
import FirstAidGame from "@/components/games/FirstAidGame";
import { ColorExplorerGame } from "@/components/games/ColorExplorerGame";
import { AnimalSoundsGame } from "@/components/games/AnimalSoundsGame";
import { 
  BookOpen, Code, Hammer, Heart, Palette, BirdIcon, Baby
} from "lucide-react";
import { GameType } from "@/types/game";

export const games: GameType[] = [
  { 
    id: "quiz", 
    title: "Knowledge Quiz", 
    component: QuizGame,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    description: "Test your knowledge with voice-controlled questions",
    instructions: "Welcome to the Knowledge Quiz! To play this game, listen to each question carefully and speak your answer clearly. Choose from the provided options by saying the answer out loud. The game will tell you if you're correct or incorrect and keep track of your score.",
    icon: BookOpen,
    category: "education"
  },
  { 
    id: "coding", 
    title: "Voice Coding", 
    component: CodingGame,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    description: "Learn coding through voice commands",
    instructions: "Welcome to Voice Coding! You can create variables by saying 'create variable name equal to value', create functions by saying 'create function name', and print to console by saying 'print' followed by your message. Use the Run Code button to execute your code.",
    icon: Code,
    category: "education"
  },
  { 
    id: "carpentry", 
    title: "Carpentry Training", 
    component: CarpentryGame,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    description: "Master carpentry skills step by step",
    instructions: "Welcome to Carpentry Training! Complete each step by saying the step name or 'next step'. You can ask 'what tools do I need' to learn about required tools, or say 'explain details' to get more information about the current step.",
    icon: Hammer,
    category: "skills"
  },
  { 
    id: "firstaid", 
    title: "First Aid Training", 
    component: FirstAidGame,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    description: "Learn life-saving first aid procedures",
    instructions: "Welcome to First Aid Training! Follow each step carefully by saying the step name or 'next step'. You can ask 'what equipment do I need' to check required equipment, or say 'explain details' to get more information about the current step.",
    icon: Heart,
    category: "skills"
  },
  { 
    id: "colorexplorer", 
    title: "Color Explorer", 
    component: ColorExplorerGame,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    description: "Learn colors through exciting voice interactions",
    instructions: "Welcome to Color Explorer! Look at the color displayed and say its name. Learn fun facts about colors while playing. If you need help, you can use the hint button to see the first letter of the color.",
    icon: Palette,
    category: "kids"
  },
  { 
    id: "animalsounds", 
    title: "Animal Sounds", 
    component: AnimalSoundsGame,
    image: "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf",
    description: "Identify animals by the sounds they make",
    instructions: "Welcome to Animal Sounds! Listen to the sound played and say which animal makes it. Learn fascinating animal facts with each correct answer. The game will give you hints if needed.",
    icon: BirdIcon,
    category: "kids"
  }
];
