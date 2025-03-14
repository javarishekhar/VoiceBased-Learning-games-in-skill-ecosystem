
import React from "react";
import { Button } from "@/components/ui/button";
import { GameInstructions } from "./GameInstructions";
import { GameType } from "@/types/game";

interface GameContainerProps {
  selectedGame: string | null;
  setSelectedGame: (id: string | null) => void;
  games: GameType[];
}

export const GameContainer: React.FC<GameContainerProps> = ({ 
  selectedGame, 
  setSelectedGame,
  games
}) => {
  if (!selectedGame) return null;
  
  const game = games.find(g => g.id === selectedGame);
  if (!game) return null;

  const GameComponent = game.component;

  return (
    <div>
      <Button 
        onClick={() => setSelectedGame(null)}
        className="mb-6 hover:bg-primary/90"
      >
        ← Back to Games
      </Button>
      <GameInstructions gameId={selectedGame} games={games} />
      <GameComponent />
    </div>
  );
};
