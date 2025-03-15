
import { Button } from "@/components/ui/button";
import { GameInstructions } from "@/components/games/GameInstructions";

interface GameDisplayProps {
  selectedGameId: string;
  games: Array<{
    id: string;
    title: string;
    component: React.ComponentType<any>;
    instructions: string;
  }>;
  onBackToGames: () => void;
}

export const GameDisplay = ({ selectedGameId, games, onBackToGames }: GameDisplayProps) => {
  const GameComponent = games.find(g => g.id === selectedGameId)?.component;
  
  if (!GameComponent) return null;

  return (
    <div>
      <Button 
        onClick={onBackToGames}
        className="mb-6 hover:bg-primary/90"
      >
        ← Back to Games
      </Button>
      <GameInstructions gameId={selectedGameId} games={games} />
      <GameComponent />
    </div>
  );
};
