
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { QuizGame } from "@/components/games/QuizGame";
import { CodingGame } from "@/components/games/CodingGame";
import { CarpentryGame } from "@/components/games/CarpentryGame";
import { FirstAidGame } from "@/components/games/FirstAidGame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Hammer, Heart, Home, Info, Mail, HelpCircle, Volume2, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const games = [
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

const Header = () => {
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

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
            
            <Button 
              variant="ghost" 
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
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

  const GameComponent = selectedGame 
    ? games.find(g => g.id === selectedGame)?.component 
    : null;

  return (
    <VoiceProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-blue-50">
        <Header />
        
        <main className="flex-1 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-primary">
              Voice Learning Games
            </h1>
            <p className="text-center mb-8 text-gray-600">
              Select a game to start learning with voice commands!
            </p>

            {!selectedGame ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {games.map((game) => (
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
                    <h2 className="text-2xl font-semibold mb-2 text-primary">{game.title}</h2>
                    <p className="text-gray-600">{game.description}</p>
                  </Card>
                ))}
              </div>
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

        <Footer />
      </div>
    </VoiceProvider>
  );
};

export default Index;
