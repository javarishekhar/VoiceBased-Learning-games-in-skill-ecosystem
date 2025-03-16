
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CongratsScreenProps {
  resetGame: () => void;
}

export function CongratsScreen({ resetGame }: CongratsScreenProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-3xl"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-blue-500 bg-clip-text text-transparent"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Congratulations!
        </motion.h1>
        <motion.div
          className="mb-8 relative p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-300/30 to-blue-300/30 rounded-lg transform -rotate-1"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-xl">
            <p className="text-2xl md:text-3xl text-gray-800 mb-4">
              You have completed the game and learned new first aid skills through your voice commands!
            </p>
            <p className="text-xl text-red-500">Happy Learning!</p>
          </div>
        </motion.div>
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <img
            src="/lovable-uploads/6f552ea6-7cfe-4e7c-bf82-c03a5e264121.png"
            alt="First aid skills"
            className="w-24 h-24 object-cover rounded-full border-4 border-red-400 shadow-lg"
          />
          <img
            src="/lovable-uploads/a7e4566d-c0fb-49f6-836c-d32c54f62356.png"
            alt="First aid skills"
            className="w-24 h-24 object-cover rounded-full border-4 border-blue-400 shadow-lg"
          />
          <img
            src="/lovable-uploads/405dfeb1-1ee5-4881-a72e-999f41b63715.png"
            alt="First aid skills"
            className="w-24 h-24 object-cover rounded-full border-4 border-green-400 shadow-lg"
          />
        </motion.div>
        <Button 
          className="mt-8 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600"
          onClick={resetGame}
        >
          Start Again
        </Button>
      </motion.div>
    </div>
  );
}
