
import { useState, useEffect } from "react";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameList } from "@/components/games/GameList";
import { GameContainer } from "@/components/games/GameContainer";
import { games } from "@/data/games";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);

  // Animate welcome message on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <VoiceProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50">
        <Header games={games} setSelectedGame={setSelectedGame} />
        
        <main className="flex-1 py-8 px-4 relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-200 opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 -left-10 w-40 h-40 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
            <div className="absolute bottom-20 right-1/4 w-52 h-52 rounded-full bg-indigo-200 opacity-20 blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className={`transition-all duration-1000 ease-out transform ${
              selectedGame ? 'opacity-0 absolute -z-10' : 'opacity-100'
            }`}>
              <h1 className={`text-4xl md:text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600 ${
                showWelcomeAnimation ? 'animate-pulse' : ''
              }`}>
                Voice Learning Games
              </h1>
              
              <div className="flex items-center justify-center gap-2 mb-8">
                <p className="text-center text-gray-600 relative">
                  Select a game to start learning with voice commands!
                  {showWelcomeAnimation && (
                    <Sparkles className="absolute -right-8 top-0 w-5 h-5 text-yellow-400 animate-bounce" />
                  )}
                </p>
              </div>
            </div>

            {!selectedGame ? (
              <GameList 
                games={games}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                setSelectedGame={setSelectedGame}
              />
            ) : (
              <GameContainer 
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
                games={games}
              />
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
