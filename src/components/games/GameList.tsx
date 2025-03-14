
import React from "react";
import { GameCard } from "./GameCard";
import { CategoryFilter } from "./CategoryFilter";
import { GameType } from "@/types/game";

interface GameListProps {
  games: GameType[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  setSelectedGame: (id: string) => void;
}

export const GameList: React.FC<GameListProps> = ({ 
  games, 
  activeCategory, 
  setActiveCategory, 
  setSelectedGame 
}) => {
  const filteredGames = activeCategory === "all" 
    ? games 
    : games.filter(game => game.category === activeCategory);

  return (
    <>
      <CategoryFilter 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredGames.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onSelect={setSelectedGame} 
          />
        ))}
      </div>
    </>
  );
};
