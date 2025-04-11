
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, Volume2 } from "lucide-react";
import { GameInfo } from "@/types/games";

interface GameInstructionsProps {
  gameId: string;
  games: GameInfo[];
}

const GameInstructions = ({ gameId, games }: GameInstructionsProps) => {
  const game = games.find(g => g.id === gameId);
  const [showInstructions, setShowInstructions] = useState(false);

  if (!game) return null;

  const speakInstructions = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(game.instructions);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          How to Use
        </Button>
        <Button
          variant="outline"
          onClick={speakInstructions}
          className="flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Read Instructions
        </Button>
      </div>
      {showInstructions && (
        <Card className="mt-4 p-4 bg-gray-50">
          <p className="text-gray-600">{game.instructions}</p>
        </Card>
      )}
    </div>
  );
};

export default GameInstructions;
