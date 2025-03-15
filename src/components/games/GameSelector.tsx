
import { Card } from "@/components/ui/card";

interface GameSelectorProps {
  games: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
  }>;
  onSelectGame: (gameId: string) => void;
}

export const GameSelector = ({ games, onSelectGame }: GameSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {games.map((game) => (
        <Card 
          key={game.id}
          className="group p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur transform hover:-translate-y-1"
          onClick={() => onSelectGame(game.id)}
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
  );
};
