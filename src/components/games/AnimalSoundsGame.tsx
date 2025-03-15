import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/contexts/VoiceContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Volume2, VolumeX, BirdIcon, Cat, Dog, Bug, Beef } from "lucide-react";

interface Animal {
  name: string;
  sound: string;
  icon: React.FC;
}

const animals: Animal[] = [
  { name: "bird", sound: "/sounds/bird.mp3", icon: BirdIcon },
  { name: "cat", sound: "/sounds/cat.mp3", icon: Cat },
  { name: "dog", sound: "/sounds/dog.mp3", icon: Dog },
  { name: "insect", sound: "/sounds/insect.mp3", icon: Bug },
  { name: "cow", sound: "/sounds/cow.mp3", icon: Beef },
];

export function AnimalSoundsGame() {
  const [currentAnimal, setCurrentAnimal] = useState(
    animals[Math.floor(Math.random() * animals.length)]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const { transcript, isListening, startListening, stopListening } =
    useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const guessedAnimal = transcript.toLowerCase().trim();

      if (guessedAnimal === currentAnimal.name) {
        stopListening();
        toast({
          title: "Correct!",
          description: `That's a ${currentAnimal.name}!`,
        });
        setTimeout(() => {
          setCurrentAnimal(
            animals[Math.floor(Math.random() * animals.length)]
          );
        }, 1500);
      } else {
        stopListening();
        toast({
          title: "Try Again",
          description: "That's not the right animal sound.",
          variant: "destructive",
        });
      }
    }
  }, [transcript, isListening, stopListening, currentAnimal, toast]);

  const playSound = () => {
    setIsPlaying(true);
    const audio = new Audio(currentAnimal.sound);
    audio.play();
    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  return (
    <Card className="p-6 max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Animal Sounds</h2>
      <p className="text-center mb-4">Listen to the animal sound and guess which animal it is.</p>

      <div className="flex justify-center items-center mb-6">
        <Button
          onClick={playSound}
          disabled={isPlaying}
          className="bg-primary hover:bg-primary/90 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4 animate-pulse" />
                Playing...
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Play Sound
              </>
            )}
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={`${
            isListening ? "bg-secondary" : "bg-primary"
          } hover:bg-opacity-90 relative overflow-hidden group`}
        >
          <span className="relative z-10">
            {isListening ? "Stop Listening" : "Start Guessing"}
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </Button>
      </div>

      {isListening && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Listening... Tell me which animal makes that sound!
        </p>
      )}
      {transcript && (
        <p className="text-center mt-2 text-sm text-gray-600">
          Heard: {transcript}
        </p>
      )}
    </Card>
  );
}
