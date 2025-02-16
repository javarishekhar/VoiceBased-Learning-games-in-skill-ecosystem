
import { useState } from "react";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { QuizGame } from "@/components/games/QuizGame";
import { CodingGame } from "@/components/games/CodingGame";
import { CarpentryGame } from "@/components/games/CarpentryGame";
import { FirstAidGame } from "@/components/games/FirstAidGame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Hammer, Heart, Home, Info, Mail } from "lucide-react";

const games = [
  { 
    id: "quiz", 
    title: "Knowledge Quiz", 
    component: QuizGame,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    description: "Test your knowledge with voice-controlled questions",
    icon: BookOpen
  },
  { 
    id: "coding", 
    title: "Voice Coding", 
    component: CodingGame,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    description: "Learn coding through voice commands",
    icon: Code
  },
  { 
    id: "carpentry", 
    title: "Carpentry Training", 
    component: CarpentryGame,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    description: "Master carpentry skills step by step",
    icon: Hammer
  },
  { 
    id: "firstaid", 
    title: "First Aid Training", 
    component: FirstAidGame,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    description: "Learn life-saving first aid procedures",
    icon: Heart
  },
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
                  <p className="text-sm text-gray-600 mb-2">
                    Our platform revolutionizes learning through voice interaction, making education more accessible and engaging.
                  </p>
                  <p className="text-sm text-gray-600">
                    Features include interactive quizzes, coding exercises, carpentry training, and first aid instruction - all controlled by voice commands.
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
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Javari Shekhar: javarishekhar@gmail.com</p>
                    <p>A Vivekananda: vivekananda@gmail.com</p>
                  </div>
                </Card>
              )}
            </div>

            {games.map((game) => (
              <div 
                key={game.id}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary cursor-pointer"
              >
                <game.icon className="w-4 h-4" />
                <span className="text-sm hidden md:inline">{game.title}</span>
              </div>
            ))}
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
        <p>&copy; {new Date().getFullYear()} All rights reserved to Javari Shekhar and A Vivekananda.</p>
      </div>
    </div>
  </footer>
);

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

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
