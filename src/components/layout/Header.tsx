
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Info, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { games } from "@/data/gameData";

export const Header = () => {
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">VoiceLearning</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-1"
                onClick={() => {
                  setShowProjectInfo(!showProjectInfo);
                  setShowContact(false);
                }}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Button>
              
              {showProjectInfo && (
                <Card className="absolute top-full mt-2 right-0 w-96 p-4 z-50 shadow-lg">
                  <h3 className="font-semibold mb-2">About Voice Learning Platform</h3>
                  <p className="text-sm text-gray-600">
                    Our platform revolutionizes learning through voice interaction, making education more accessible and engaging.
                  </p>
                </Card>
              )}
            </div>

            <div className="relative">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-1"
                onClick={() => {
                  setShowContact(!showContact);
                  setShowProjectInfo(false);
                }}
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Button>
              
              {showContact && (
                <Card className="absolute top-full mt-2 right-0 w-72 p-4 z-50 shadow-lg">
                  <h3 className="font-semibold mb-2">Contact Us</h3>
                  <p className="text-sm text-gray-600">Email: contact@voicelearning.com</p>
                </Card>
              )}
            </div>

            <TooltipProvider>
              {games.map((game) => (
                <Tooltip key={game.id}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 text-gray-600 hover:text-primary cursor-pointer">
                      <game.icon className="w-4 h-4" />
                      <span className="text-sm hidden md:inline">{game.title}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Welcome Shekhar, let's play the game..!!</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </nav>
    </header>
  );
};
