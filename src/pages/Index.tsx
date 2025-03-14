
import { useState } from "react";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { QuizGame } from "@/components/games/QuizGame";
import { CodingGame } from "@/components/games/CodingGame";
import { CarpentryGame } from "@/components/games/CarpentryGame";
import { FirstAidGame } from "@/components/games/FirstAidGame";
import { StoryBuilderGame } from "@/components/games/StoryBuilderGame";
import { RhythmMasterGame } from "@/components/games/RhythmMasterGame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Code, Hammer, Heart, Home, Info, Mail, HelpCircle, Volume2, 
  Music, BookType, Baby
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const games = [
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

const Header = () => {
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">VoiceLearning</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-1"
                onClick={() => {
                  setShowProjectInfo(!showProjectInfo);
                  setShowContact(false);
                }}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Button>
              
              {showProjectInfo && (
                <Card className="absolute top-full mt-2 right-0 w-96 p-4 z-50 shadow-lg">
                  <h3 className="font-semibold mb-2">About Voice Learning Platform</h3>
                  <p className="text-sm text-gray-600">
                    Our platform revolutionizes learning through voice interaction, making education more accessible and engaging.
                  </p>
                </Card>
              )}
            </div>

            <div className="relative">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-1"
                onClick={() => {
                  setShowContact(!showContact);
                  setShowProjectInfo(false);
                }}
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Button>
              
              {showContact && (
                <Card className="absolute top-full mt-2 right-0 w-72 p-4 z-50 shadow-lg">
                  <h3 className="font-semibold mb-2">Contact Us</h3>
                  <p className="text-sm text-gray-600">Email: contact@voicelearning.com</p>
                </Card>
              )}
            </div>

            <TooltipProvider>
              {games.map((game) => (
                <Tooltip key={game.id}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 text-gray-600 hover:text-primary cursor-pointer">
                      <game.icon className="w-4 h-4" />
                      <span className="text-sm hidden md:inline">{game.title}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Welcome Shekhar, let's play the game..!!</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-white border-t mt-auto">
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="text-center text-gray-600 text-sm">
        <p>Developed by Shekhar and Vivekananda</p>
      </div>
    </div>
  </footer>
);

const GameInstructions = ({ gameId }) => {
  const game = games.find(g => g.id === gameId);
  const [showInstructions, setShowInstructions] = useState(false);

  const speakInstructions = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(game.instructions);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          How to Use
        </Button>
        <Button
          variant="outline"
          onClick={speakInstructions}
          className="flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Read Instructions
        </Button>
      </div>
      {showInstructions && (
        <Card className="mt-4 p-4 bg-gray-50">
          <p className="text-gray-600">{game.instructions}</p>
        </Card>
      )}
    </div>
  );
};

const Index = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const GameComponent = selectedGame 
    ? games.find(g => g.id === selectedGame)?.component 
    : null;

  const filteredGames = activeCategory === "all" 
    ? games 
    : games.filter(game => game.category === activeCategory);

  return (
    <VoiceProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-blue-50">
        <header className="bg-white shadow-sm">
          <nav className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Home className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold text-primary">VoiceLearning</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-1"
                    onClick={() => {}}
                  >
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </Button>
                </div>

                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-1"
                    onClick={() => {}}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </Button>
                </div>

                <TooltipProvider>
                  {games.map((game) => (
                    <Tooltip key={game.id}>
                      <TooltipTrigger asChild>
                        <div 
                          className="flex items-center space-x-1 text-gray-600 hover:text-primary cursor-pointer"
                          onClick={() => setSelectedGame(game.id)}
                        >
                          <game.icon className="w-4 h-4" />
                          <span className="text-sm hidden md:inline">{game.title}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Play {game.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          </nav>
        </header>
        
        <main className="flex-1 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-primary">
              Voice Learning Games
            </h1>
            <p className="text-center mb-8 text-gray-600">
              Select a game to start learning with voice commands!
            </p>

            {!selectedGame ? (
              <>
                {/* Category filters */}
                <div className="flex justify-center gap-3 mb-8">
                  <Button 
                    variant={activeCategory === "all" ? "default" : "outline"}
                    onClick={() => setActiveCategory("all")}
                  >
                    All Games
                  </Button>
                  <Button 
                    variant={activeCategory === "education" ? "default" : "outline"}
                    onClick={() => setActiveCategory("education")}
                  >
                    Education
                  </Button>
                  <Button 
                    variant={activeCategory === "skills" ? "default" : "outline"}
                    onClick={() => setActiveCategory("skills")}
                  >
                    Skills Training
                  </Button>
                  <Button 
                    variant={activeCategory === "kids" ? "default" : "outline"}
                    onClick={() => setActiveCategory("kids")}
                    className="flex items-center gap-1"
                  >
                    <Baby className="w-4 h-4" />
                    Kids Games
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredGames.map((game) => (
                    <Card 
                      key={game.id}
                      className="group p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur transform hover:-translate-y-1"
                      onClick={() => setSelectedGame(game.id)}
                    >
                      <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={game.image} 
                          alt={game.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <game.icon className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-semibold text-primary">{game.title}</h2>
                      </div>
                      <p className="text-gray-600">{game.description}</p>

                      {/* Category badge */}
                      <div className="mt-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          game.category === "kids" ? "bg-pink-100 text-pink-800" :
                          game.category === "education" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {game.category === "kids" ? "Kids" : 
                           game.category === "education" ? "Education" : 
                           "Skills Training"}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <Button 
                  onClick={() => setSelectedGame(null)}
                  className="mb-6 hover:bg-primary/90"
                >
                  ← Back to Games
                </Button>
                <GameInstructions gameId={selectedGame} />
                {GameComponent && <GameComponent />}
              </div>
            )}
            
            <VoiceIndicator />
          </div>
        </main>

        <footer className="bg-white border-t mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center text-gray-600 text-sm">
              <p>Developed by Shekhar and Vivekananda</p>
            </div>
          </div>
        </footer>
      </div>
    </VoiceProvider>
  );
};

export default Index;
