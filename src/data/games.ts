
import { QuizGame } from "@/components/games/QuizGame";
import { CodingGame } from "@/components/games/CodingGame";
import { CarpentryGame } from "@/components/games/CarpentryGame";
import { FirstAidGame } from "@/components/games/FirstAidGame";
import { StoryBuilderGame } from "@/components/games/StoryBuilderGame";
import { RhythmMasterGame } from "@/components/games/RhythmMasterGame";
import { 
  BookOpen, Code, Hammer, Heart, Music, BookType, Baby
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
    id: "storybuilder", 
    title: "Story Builder", 
    component: StoryBuilderGame,
    image: "https://images.unsplash.com/photo-1512081409002-5af286fe5f87",
    description: "Create imaginative stories with your voice",
    instructions: "Welcome to Story Builder! Listen to the beginning of a story, then continue it using your voice. Be creative and add exciting parts to the adventure. The game will respond to your ideas and build a complete story together with you.",
    icon: BookType,
    category: "kids"
  },
  { 
    id: "rhythmmaster", 
    title: "Rhythm Master", 
    component: RhythmMasterGame,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    description: "Learn music patterns and notes by repeating rhythms",
    instructions: "Welcome to Rhythm Master! Listen carefully to the musical pattern played, then repeat it using your voice by saying the note names (like 'Do Re Mi'). Match the sequence correctly to unlock new instruments and advance to more complex patterns.",
    icon: Music,
    category: "kids"
  }
];
