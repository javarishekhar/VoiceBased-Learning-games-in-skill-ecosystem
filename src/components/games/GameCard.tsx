
import React from "react";
import { Card } from "@/components/ui/card";
import { GameType } from "@/types/game";

interface GameCardProps {
  game: GameType;
  onSelect: (id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  return (
    <Card 
      key={game.id}
      className="group p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur transform hover:-translate-y-1"
      onClick={() => onSelect(game.id)}
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
  );
};
