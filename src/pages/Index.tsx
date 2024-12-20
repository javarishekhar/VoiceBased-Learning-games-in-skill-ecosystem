import { useState } from "react";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { QuizGame } from "@/components/games/QuizGame";
import { CodingGame } from "@/components/games/CodingGame";
import { CarpentryGame } from "@/components/games/CarpentryGame";
import { FirstAidGame } from "@/components/games/FirstAidGame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const games = [
  { id: "quiz", title: "Knowledge Quiz", component: QuizGame },
  { id: "coding", title: "Voice Coding", component: CodingGame },
  { id: "carpentry", title: "Carpentry Training", component: CarpentryGame },
  { id: "firstaid", title: "First Aid Training", component: FirstAidGame },
];

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const GameComponent = selectedGame 
    ? games.find(g => g.id === selectedGame)?.component 
    : null;

  return (
    <VoiceProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-primary">
            Voice Learning Games
          </h1>
          <p className="text-center mb-8 text-gray-600">
            Select a game to start learning with voice commands!
          </p>

          {!selectedGame ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games.map((game) => (
                <Card 
                  key={game.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <h2 className="text-2xl font-semibold mb-2 text-primary">{game.title}</h2>
                  <p className="text-gray-600">Click to start learning!</p>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <Button 
                onClick={() => setSelectedGame(null)}
                className="mb-6"
              >
                ← Back to Games
              </Button>
              {GameComponent && <GameComponent />}
            </div>
          )}
          
          <VoiceIndicator />
        </div>
      </div>
    </VoiceProvider>
  );
};

export default Index;