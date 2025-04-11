
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
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
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
          <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-primary/30 rounded-lg transform -rotate-1"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-xl">
            <p className="text-2xl md:text-3xl text-gray-800 mb-4">
              You have completed the game and learned new carpentry skills through your voice commands!
            </p>
            <p className="text-xl text-accent">Happy Learning!</p>
          </div>
        </motion.div>
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <img
            src="/lovable-uploads/3533d798-6ecd-4840-8d7f-03eab519abae.png"
            alt="Carpentry skills"
            className="w-24 h-24 object-cover rounded-full border-4 border-secondary shadow-lg"
          />
          <img
            src="/lovable-uploads/70b909c8-7da9-4f15-9154-b47ce62e8412.png"
            alt="Carpentry skills"
            className="w-24 h-24 object-cover rounded-full border-4 border-primary shadow-lg"
          />
          <img
            src="/lovable-uploads/a8ab20ca-9a89-46d9-bf40-7e5cd72588fa.png"
            alt="Carpentry skills"
            className="w-24 h-24 object-cover rounded-full border-4 border-accent shadow-lg"
          />
        </motion.div>
        <Button 
          className="mt-8 bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90"
          onClick={resetGame}
        >
          Start Again
        </Button>
      </motion.div>
    </div>
  );
}
