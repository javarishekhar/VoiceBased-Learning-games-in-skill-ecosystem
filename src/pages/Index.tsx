
import { useState } from "react";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameList } from "@/components/games/GameList";
import { GameContainer } from "@/components/games/GameContainer";
import { games } from "@/data/games";

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <VoiceProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-blue-50">
        <Header games={games} setSelectedGame={setSelectedGame} />
        
        <main className="flex-1 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-primary">
              Voice Learning Games
            </h1>
            <p className="text-center mb-8 text-gray-600">
              Select a game to start learning with voice commands!
            </p>

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
