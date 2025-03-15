
import React from "react";
import { Card } from "@/components/ui/card";
import { GameType } from "@/types/game";
import { motion } from "framer-motion";

interface GameCardProps {
  game: GameType;
  onSelect: (id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  // Define category colors and labels
  const categoryStyles = {
    kids: {
      bg: "bg-pink-100",
      text: "text-pink-800",
      label: "Kids"
    },
    education: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Education"
    },
    skills: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Skills Training"
    }
  };
  
  const category = categoryStyles[game.category];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card 
        key={game.id}
        className="group p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white backdrop-blur relative overflow-hidden"
        onClick={() => onSelect(game.id)}
      >
        <div className="aspect-video mb-4 overflow-hidden rounded-lg">
          <img 
            src={game.image} 
            alt={game.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-sm font-light">{game.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <game.icon className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold text-primary">{game.title}</h2>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{game.description}</p>

        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${category.bg} ${category.text}`}>
            {category.label}
          </span>
          
          <motion.div 
            className="bg-primary/10 w-7 h-7 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <game.icon className="w-4 h-4 text-primary" />
          </motion.div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-lg">
          <motion.div 
            className="bg-white/90 rounded-full w-14 h-14 flex items-center justify-center"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-primary ml-1"></div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
