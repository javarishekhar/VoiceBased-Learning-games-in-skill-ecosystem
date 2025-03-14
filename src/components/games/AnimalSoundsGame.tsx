
import React, { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Volume2, RefreshCw, Sparkles, Rabbit, Dog, Cat, Bird, Fish, Turtle, Frog, Cow 
} from "lucide-react";

// Define animal challenges
const animalChallenges = [
  {
    name: "dog",
    sound: "woof",
    alternativeSounds: ["bark", "arf", "ruff"],
    funFact: "Dogs can hear sounds up to four times farther away than humans!",
    icon: Dog,
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/1563/1563-preview.mp3",
    animationColor: "#8B5CF6"
  },
  {
    name: "cat",
    sound: "meow",
    alternativeSounds: ["mew", "purr"],
    funFact: "Cats can't taste sweet things because they don't have sweet taste buds!",
    icon: Cat,
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
    animationColor: "#EC4899"
  },
  {
    name: "bird",
    sound: "tweet",
    alternativeSounds: ["chirp", "sing", "whistle"],
    funFact: "Some birds can remember thousands of different hiding spots for their food!",
    icon: Bird,
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/2348/2348-preview.mp3",
    animationColor: "#3B82F6"
  },
  {
    name: "cow",
    sound: "moo",
    alternativeSounds: [],
    funFact: "Cows have best friends and get stressed when they are separated!",
    icon: Cow,
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/2400/2400-preview.mp3",
    animationColor: "#6B7280"
  },
  {
    name: "frog",
    sound: "ribbit",
    alternativeSounds: ["croak"],
    funFact: "Some frogs can jump over 20 times their body length in one hop!",
    icon: Frog,
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/2399/2399-preview.mp3",
    animationColor: "#10B981"
  },
  {
    name: "fish",
    sound: "blub",
    alternativeSounds: ["splash", "bubble"],
    funFact: "Fish communicate with each other by grinding their teeth or rubbing body parts together!",
    icon: Fish,
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/2365/2365-preview.mp3", // bubbling sound
    animationColor: "#0EA5E9"
  },
  {
    name: "rabbit",
    sound: "thump",
    alternativeSounds: ["sniff", "squeak"],
    funFact: "Rabbits jump and twist in the air when they're happy - it's called a 'binky'!",
    icon: Rabbit,
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/2686/2686-preview.mp3", // hopping sound
    animationColor: "#F59E0B"
  },
  {
    name: "turtle",
    sound: "hiss",
    alternativeSounds: [],
    funFact: "Some turtles can live for over 100 years, making them one of the longest living animals!",
    icon: Turtle,
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/1686/1686-preview.mp3", // slow movement sound
    animationColor: "#34D399"
  }
];

// Animation component for animals
const AnimalAnimation = ({ animal, isPlaying }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Get animation color
    const colorHex = animal?.animationColor || "#4F46E5";
    
    // Convert hex to rgba
    const hexToRgba = (hex, alpha = 1) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    // Create particles based on animal
    const particles = [];
    const particleCount = 120;
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 10 + 5;
      
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + size,
        size: size,
        color: hexToRgba(colorHex, Math.random() * 0.7 + 0.3),
        speedY: -(Math.random() * 3 + 1),
        speedX: (Math.random() - 0.5) * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        shape: Math.floor(Math.random() * 3) // 0: circle, 1: square, 2: triangle
      });
    }
    
    // Animation loop
    let animationId;
    
    const drawParticle = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      
      if (p.shape === 0) {
        // Circle
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 1) {
        // Square (paw print like)
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      } else {
        // Triangle
        ctx.beginPath();
        ctx.moveTo(0, -p.size/2);
        ctx.lineTo(-p.size/2, p.size/2);
        ctx.lineTo(p.size/2, p.size/2);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.restore();
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        drawParticle(p);
        
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        
        // Reset particle when it goes off top
        if (p.y < -p.size) {
          p.y = canvas.height + p.size;
          p.x = Math.random() * canvas.width;
        }
        
        // Bounce off sides
        if (p.x < -p.size) p.speedX = Math.abs(p.speedX);
        if (p.x > canvas.width + p.size) p.speedX = -Math.abs(p.speedX);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, animal]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
    />
  );
};

export function AnimalSoundsGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("waiting"); // waiting, listening, correct, incorrect
  const [showAnimation, setShowAnimation] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [completedAnimals, setCompletedAnimals] = useState<string[]>([]);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();
  const audioRef = useRef(null);
  
  // Function to play animal sound
  const playAnimalSound = () => {
    const animal = animalChallenges[currentChallenge];
    
    if (animal.soundUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      audioRef.current = new Audio(animal.soundUrl);
      audioRef.current.volume = 0.3;
      audioRef.current.play();
      
      setSoundPlayed(true);
      setGameState("waiting");
      
      // Display toast with hint
      toast({
        title: "What animal makes this sound?",
        description: `Listen carefully and tell me what animal it is!`,
      });
    }
  };
  
  // Process voice commands
  useEffect(() => {
    if (transcript && isListening && soundPlayed) {
      const answer = transcript.toLowerCase().trim();
      const animal = animalChallenges[currentChallenge];
      
      // Check if answer matches animal name
      if (answer.includes(animal.name)) {
        // Correct answer
        stopListening();
        setGameState("correct");
        setShowAnimation(true);
        setScore(prev => prev + 1);
        setCompletedAnimals(prev => [...prev, animal.name]);
        
        // Play success sound
        const successAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3");
        successAudio.volume = 0.3;
        successAudio.play();
        
        toast({
          title: "Correct!",
          description: animal.funFact,
          variant: "default",
        });
        
        // Reset after animation
        setTimeout(() => {
          setShowAnimation(false);
          setGameState("waiting");
          setSoundPlayed(false);
          
          // Move to next challenge or end game
          if (currentChallenge < animalChallenges.length - 1) {
            setCurrentChallenge(prev => prev + 1);
          } else {
            // Game complete
            toast({
              title: "Game Complete!",
              description: `Amazing! You identified ${score + 1} animal sounds!`,
              variant: "default",
            });
            
            // Reset game after short delay
            setTimeout(() => {
              setCurrentChallenge(0);
              setCompletedAnimals([]);
              setScore(0);
            }, 3000);
          }
        }, 3000);
        
      } else if (answer.length > 2) {
        // Check if they said the sound instead of the animal
        const isSound = animal.sound === answer || 
                        animal.alternativeSounds.some(sound => answer.includes(sound));
        
        if (isSound) {
          stopListening();
          toast({
            title: "Almost!",
            description: `That's the sound it makes! But what animal says "${animal.sound}"?`,
            variant: "default",
          });
          return;
        }
        
        // Incorrect answer
        stopListening();
        setGameState("incorrect");
        setShowAnimation(false);
        
        toast({
          title: "Try Again",
          description: `Let's listen to the sound one more time!`,
          variant: "destructive",
        });
        
        // Reset after short delay
        setTimeout(() => {
          setGameState("waiting");
          setSoundPlayed(false);
        }, 2000);
      }
    }
  }, [transcript, currentChallenge, isListening, stopListening, toast, score, soundPlayed]);
  
  // Reset the game
  const resetGame = () => {
    setCurrentChallenge(0);
    setScore(0);
    setGameState("waiting");
    setSoundPlayed(false);
    setCompletedAnimals([]);
    toast({
      title: "Game Reset",
      description: "Let's start a new animal sounds adventure!",
    });
  };
  
  // Current animal
  const animal = animalChallenges[currentChallenge];
  const AnimalIcon = animal.icon;
  
  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10 bg-gradient-to-br from-white to-yellow-50 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">
          Animal Sounds Explorer
        </h2>
        <div className="flex items-center justify-center px-3 py-1 bg-white rounded-full shadow-sm">
          <span className="text-sm font-medium text-amber-600">Score: {score}/{animalChallenges.length}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-amber-500" />
          Listen and Guess
        </h3>
        <p className="text-center mb-2 text-gray-700">
          {soundPlayed 
            ? "What animal makes this sound?" 
            : "Press the Play Sound button to hear an animal sound!"}
        </p>
      </div>
      
      {/* Animal display area with animations */}
      <div className="relative mb-6 h-60 rounded-xl overflow-hidden bg-gradient-to-b from-amber-50 to-white">
        <AnimalAnimation 
          animal={animal} 
          isPlaying={showAnimation} 
        />
        
        {/* Central content */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {gameState === "correct" ? (
            <div className="text-center">
              <AnimalIcon className="w-24 h-24 text-amber-500 animate-bounce mx-auto" />
              <p className="text-2xl font-bold text-amber-600 mt-2">
                {animal.name.toUpperCase()}!
              </p>
            </div>
          ) : gameState === "incorrect" ? (
            <div className="text-center">
              <p className="text-xl font-bold text-red-500 mb-2">Try Again!</p>
              <p className="text-gray-600">Listen carefully to the sound</p>
            </div>
          ) : (
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full bg-amber-100 mx-auto flex items-center justify-center ${soundPlayed ? 'ring-4 ring-amber-300 animate-pulse' : ''}`}>
                <Volume2 className="w-12 h-12 text-amber-500" />
              </div>
              <p className="text-gray-600 mt-3">
                {soundPlayed ? "Say the animal name!" : "Press Play to start"}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress indicators */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {animalChallenges.map((animal, idx) => (
          <div 
            key={idx}
            className={`w-6 h-6 rounded-full transition-all ${
              completedAnimals.includes(animal.name) 
                ? 'bg-amber-500' 
                : 'bg-gray-200'
            } ${
              idx === currentChallenge && 'ring-2 ring-offset-2 ring-amber-500'
            }`}
          />
        ))}
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onClick={playAnimalSound}
            className="flex-1 bg-amber-500 hover:bg-amber-600"
            disabled={gameState === "correct" || gameState === "incorrect"}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Play Sound
          </Button>
          
          <Button
            onClick={() => {
              if (!soundPlayed) {
                playAnimalSound();
                setTimeout(() => startListening(), 1000);
              } else {
                isListening ? stopListening() : startListening();
              }
            }}
            className={`flex-1 ${isListening ? "bg-secondary" : "bg-primary"}`}
            disabled={gameState === "correct" || gameState === "incorrect"}
          >
            {isListening ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span>Listening...</span>
              </div>
            ) : (
              "Answer"
            )}
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={resetGame}
          className="flex items-center justify-center gap-1"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          <span>New Game</span>
        </Button>
      </div>
      
      {transcript && isListening && (
        <p className="text-center mt-3 text-sm text-gray-600 bg-white p-2 rounded">
          I heard: <span className="font-medium">{transcript}</span>
        </p>
      )}
      
      {/* Sound hint for young kids */}
      {gameState === "waiting" && soundPlayed && (
        <div className="mt-4 bg-white/80 p-3 rounded-lg border border-amber-200 animate-fade-in">
          <p className="text-sm text-center text-gray-700">
            This animal says <span className="font-bold">"{animal.sound}"</span>
            {animal.alternativeSounds.length > 0 && ` or "${animal.alternativeSounds[0]}"`}
          </p>
        </div>
      )}
      
      {/* Fun fact appears when correct */}
      {gameState === "correct" && (
        <div className="mt-4 bg-white/80 p-3 rounded-lg border border-amber-200 animate-fade-in">
          <p className="text-sm text-gray-700 flex items-start">
            <Sparkles className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>{animal.funFact}</span>
          </p>
        </div>
      )}
    </Card>
  );
}
