
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/services/userService";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameInstructions } from "@/components/games/GameInstructions";
import { GamesList } from "@/components/games/GamesList";
import { games } from "@/data/gameData";

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();

  const GameComponent = selectedGame 
    ? games.find(g => g.id === selectedGame)?.component 
    : null;

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <VoiceProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-blue-50">
        <Header />
        
        <div className="container mx-auto px-4">
          <div className="flex justify-end my-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
        
        <main className="flex-1 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-primary">
              Voice Learning Games
            </h1>
            <p className="text-center mb-8 text-gray-600">
              Select a game to start learning with voice commands!
            </p>

            {!selectedGame ? (
              <GamesList onSelectGame={setSelectedGame} />
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
