
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";

const alphabetData = [
  { letter: "A", word: "Apple", image: "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?q=80&w=500", color: "#FF5733" },
  { letter: "B", word: "Butterfly", image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=500", color: "#33A8FF" },
  { letter: "C", word: "Cat", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500", color: "#FF33E9" },
  { letter: "D", word: "Dog", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=500", color: "#33FF57" },
  { letter: "E", word: "Elephant", image: "https://images.unsplash.com/photo-1559253664-ca249d4608c6?q=80&w=500", color: "#B533FF" },
  { letter: "F", word: "Fish", image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=500", color: "#FF8333" },
  { letter: "G", word: "Giraffe", image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?q=80&w=500", color: "#337DFF" },
  { letter: "H", word: "Horse", image: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=500", color: "#33FFB5" },
  { letter: "I", word: "Ice Cream", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=500", color: "#FF3357" },
  { letter: "J", word: "Jellyfish", image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=500", color: "#8FFF33" },
  { letter: "K", word: "Kangaroo", image: "https://images.unsplash.com/photo-1579168765467-3b235f938439?q=80&w=500", color: "#FF33A8" },
  { letter: "L", word: "Lion", image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=500", color: "#33FFF8" },
  { letter: "M", word: "Monkey", image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=500", color: "#FF3333" },
  { letter: "N", word: "Nest", image: "https://images.unsplash.com/photo-1518401543587-2a2a0a66e414?q=80&w=500", color: "#33FF33" },
  { letter: "O", word: "Owl", image: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?q=80&w=500", color: "#3333FF" },
  { letter: "P", word: "Penguin", image: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?q=80&w=500", color: "#FF33E0" },
  { letter: "Q", word: "Queen", image: "https://images.unsplash.com/photo-1578950114438-9c05b0323efd?q=80&w=500", color: "#33FFE0" },
  { letter: "R", word: "Rabbit", image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=500", color: "#FF5733" },
  { letter: "S", word: "Snake", image: "https://images.unsplash.com/photo-1531386151447-d9c0dad30d40?q=80&w=500", color: "#33A8FF" },
  { letter: "T", word: "Tiger", image: "https://images.unsplash.com/photo-1477764250597-dffe9f601ae8?q=80&w=500", color: "#FF33E9" },
  { letter: "U", word: "Umbrella", image: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=500", color: "#33FF57" },
  { letter: "V", word: "Volcano", image: "https://images.unsplash.com/photo-1554226983-a25f265af48a?q=80&w=500", color: "#B533FF" },
  { letter: "W", word: "Watermelon", image: "https://images.unsplash.com/photo-1563114773-84221bd62daa?q=80&w=500", color: "#FF8333" },
  { letter: "X", word: "Xylophone", image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=500", color: "#337DFF" },
  { letter: "Y", word: "Yacht", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=500", color: "#33FFB5" },
  { letter: "Z", word: "Zebra", image: "https://images.unsplash.com/photo-1526095179574-86e545346ae6?q=80&w=500", color: "#FF3357" }
];

export function AlphabetGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    speechRef.current = new SpeechSynthesisUtterance();
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (speechRef.current && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      speechRef.current.text = text;
      speechRef.current.rate = 0.8;
      window.speechSynthesis.speak(speechRef.current);
    }
  };

  const goToNextLetter = () => {
    if (currentIndex < alphabetData.length - 1) {
      setShowAnimation(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowAnimation(false);
        // Play success sound
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 500);
    } else {
      toast({
        title: "Congratulations!",
        description: "You've completed the alphabet!",
        variant: "default",
      });
    }
  };

  const goToPreviousLetter = () => {
    if (currentIndex > 0) {
      setShowAnimation(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setShowAnimation(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing alphabet command:", command);
      
      if (command.includes("next") || command.includes("forward")) {
        stopListening();
        goToNextLetter();
      } else if (command.includes("previous") || command.includes("back")) {
        stopListening();
        goToPreviousLetter();
      } else if (command.includes("say") || command.includes("speak")) {
        stopListening();
        const currentLetter = alphabetData[currentIndex];
        speakText(`${currentLetter.letter} is for ${currentLetter.word}`);
      }
    }
  }, [transcript, isListening, stopListening, currentIndex]);

  const currentLetter = alphabetData[currentIndex];

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Alphabet Learning</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Say "Next" or "Forward" to go to the next letter</li>
          <li>• Say "Previous" or "Back" to go to the previous letter</li>
          <li>• Say "Speak" or "Say" to hear the letter and word</li>
        </ul>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={showAnimation ? { opacity: 0, x: 50 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex flex-col items-center mb-6"
        >
          <div 
            className="w-32 h-32 rounded-full flex items-center justify-center mb-4 text-white text-7xl font-bold"
            style={{ backgroundColor: currentLetter.color }}
          >
            {currentLetter.letter}
          </div>
          
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold">{currentLetter.letter} is for {currentLetter.word}</h3>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg mb-6 w-full">
            <img 
              src={currentLetter.image} 
              alt={currentLetter.word}
              className="w-full h-64 object-cover"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <Button
          onClick={goToPreviousLetter}
          disabled={currentIndex === 0}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2" /> Previous
        </Button>
        
        <Button
          onClick={() => speakText(`${currentLetter.letter} is for ${currentLetter.word}`)}
          variant="outline"
          className="mx-2"
        >
          <Volume2 className="mr-2" /> Speak
        </Button>
        
        <Button
          onClick={goToNextLetter}
          disabled={currentIndex === alphabetData.length - 1}
          className="flex items-center"
        >
          Next <ArrowRight className="ml-2" />
        </Button>
      </div>

      <div className="mt-6">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={isListening ? "bg-secondary w-full" : "bg-primary w-full"}
        >
          {isListening ? "Stop Listening" : "Start Speaking"}
        </Button>
      </div>

      {isListening && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-sm text-gray-600"
        >
          Listening... Say a command!
        </motion.p>
      )}
      
      {transcript && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-2 text-sm text-gray-600"
        >
          Heard: {transcript}
        </motion.p>
      )}

      {/* Sound effect for navigation */}
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-game-success-alert-2039.mp3" />
    </Card>
  );
}
