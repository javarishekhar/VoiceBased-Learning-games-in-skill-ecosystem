
import React, { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Palette, Sparkles, RefreshCw, Volume2 } from "lucide-react";

// Color challenges with educational content
const colorChallenges = [
  {
    color: "red",
    object: "apple",
    funFact: "Red is a primary color that can make your heart beat faster!",
    background: "bg-red-500"
  },
  {
    color: "blue",
    object: "ocean",
    funFact: "Blue is a primary color that can make you feel calm and peaceful.",
    background: "bg-blue-500"
  },
  {
    color: "yellow",
    object: "sun",
    funFact: "Yellow is a primary color that can make you feel happy and energetic!",
    background: "bg-yellow-400"
  },
  {
    color: "green",
    object: "leaf",
    funFact: "Green is a secondary color made by mixing blue and yellow.",
    background: "bg-green-500"
  },
  {
    color: "purple",
    object: "grapes",
    funFact: "Purple is a secondary color made by mixing red and blue.",
    background: "bg-purple-500"
  },
  {
    color: "orange",
    object: "carrot",
    funFact: "Orange is a secondary color made by mixing red and yellow.",
    background: "bg-orange-500"
  },
  {
    color: "pink",
    object: "flower",
    funFact: "Pink is a tint of red, which means it's red mixed with white!",
    background: "bg-pink-400"
  },
  {
    color: "brown",
    object: "chocolate",
    funFact: "Brown is created by mixing all three primary colors together.",
    background: "bg-amber-700"
  }
];

// Interactive animation component
const ColorAnimation = ({ color, isPlaying, isCorrect }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Animation variables
    const particles = [];
    const particleCount = isCorrect ? 100 : 20;
    
    // Get color RGB values
    const getColorRGB = (colorName) => {
      const colorMap = {
        red: [255, 59, 48],
        blue: [0, 122, 255],
        yellow: [255, 204, 0],
        green: [52, 199, 89],
        purple: [175, 82, 222],
        orange: [255, 149, 0],
        pink: [255, 45, 85],
        brown: [162, 132, 94]
      };
      
      return colorMap[colorName] || [100, 100, 100];
    };
    
    // Create particles
    const rgb = getColorRGB(color);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: Math.random() * 8 + 2,
        color: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Math.random() * 0.5 + 0.5})`,
        speedX: (Math.random() - 0.5) * (isCorrect ? 12 : 6),
        speedY: (Math.random() - 0.5) * (isCorrect ? 12 : 6),
        direction: Math.random() * Math.PI * 2,
        rotation: Math.random() * 5,
        rotationSpeed: Math.random() * 0.2 - 0.1
      });
    }
    
    // Animation loop
    let animationId;
    
    const drawParticle = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      if (isCorrect) {
        // Draw star shape for correct answers
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(
            Math.cos((i * 2 * Math.PI) / 5) * p.size,
            Math.sin((i * 2 * Math.PI) / 5) * p.size
          );
          ctx.lineTo(
            Math.cos(((i * 2 + 1) * Math.PI) / 5) * (p.size / 2),
            Math.sin(((i * 2 + 1) * Math.PI) / 5) * (p.size / 2)
          );
        }
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.fill();
      } else {
        // Draw circle for normal state
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      
      ctx.restore();
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        drawParticle(p);
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Apply gravity effect for correct animations
        if (isCorrect) {
          p.speedY += 0.1;
        }
        
        // Remove particles that are off-screen
        if (
          p.x < -50 ||
          p.x > canvas.width + 50 ||
          p.y < -50 ||
          p.y > canvas.height + 50
        ) {
          if (isCorrect) {
            // Reset particle to come from a random edge
            const edge = Math.floor(Math.random() * 4);
            
            if (edge === 0) { // top
              p.x = Math.random() * canvas.width;
              p.y = -10;
              p.speedY = Math.abs(p.speedY);
            } else if (edge === 1) { // right
              p.x = canvas.width + 10;
              p.y = Math.random() * canvas.height;
              p.speedX = -Math.abs(p.speedX);
            } else if (edge === 2) { // bottom
              p.x = Math.random() * canvas.width;
              p.y = canvas.height + 10;
              p.speedY = -Math.abs(p.speedY);
            } else { // left
              p.x = -10;
              p.y = Math.random() * canvas.height;
              p.speedX = Math.abs(p.speedX);
            }
          }
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, color, isCorrect]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
    />
  );
};

export function ColorExplorerGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("playing"); // playing, correct, incorrect
  const [showAnimation, setShowAnimation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedColors, setCompletedColors] = useState<string[]>([]);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();
  
  // Reference for the color display
  const colorDisplayRef = useRef(null);
  
  // Process voice commands
  useEffect(() => {
    if (transcript && isListening) {
      const answer = transcript.toLowerCase().trim();
      const challenge = colorChallenges[currentChallenge];
      
      if (answer.includes(challenge.color)) {
        // Correct answer
        stopListening();
        setGameState("correct");
        setShowAnimation(true);
        setScore(prev => prev + 1);
        setCompletedColors(prev => [...prev, challenge.color]);
        
        // Play success sound
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3");
        audio.volume = 0.3;
        audio.play();
        
        toast({
          title: "Correct!",
          description: challenge.funFact,
          variant: "default",
        });
        
        // Reset after animation
        setTimeout(() => {
          setShowAnimation(false);
          setGameState("playing");
          
          // Move to next challenge or end game
          if (currentChallenge < colorChallenges.length - 1) {
            setCurrentChallenge(prev => prev + 1);
          } else {
            // Game complete
            toast({
              title: "Game Complete!",
              description: `Amazing! You found ${score + 1} colors!`,
              variant: "default",
            });
            
            // Reset game after short delay
            setTimeout(() => {
              setCurrentChallenge(0);
              setCompletedColors([]);
            }, 3000);
          }
        }, 3000);
        
      } else if (answer.length > 2) {
        // Incorrect answer
        stopListening();
        setGameState("incorrect");
        setShowAnimation(true);
        
        toast({
          title: "Try Again",
          description: `What color do you see? Hint: It starts with "${challenge.color[0]}"`,
          variant: "destructive",
        });
        
        // Reset after animation
        setTimeout(() => {
          setShowAnimation(false);
          setGameState("playing");
        }, 2000);
      }
    }
  }, [transcript, currentChallenge, isListening, stopListening, toast, score]);
  
  // Read the color clue aloud
  const speakClue = () => {
    if ('speechSynthesis' in window) {
      const challenge = colorChallenges[currentChallenge];
      const utterance = new SpeechSynthesisUtterance(`Can you find the color of a ${challenge.object}?`);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setCurrentChallenge(0);
    setScore(0);
    setGameState("playing");
    setCompletedColors([]);
    toast({
      title: "Game Reset",
      description: "Let's start a new color adventure!",
    });
  };
  
  // Current challenge
  const challenge = colorChallenges[currentChallenge];
  
  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10 bg-gradient-to-br from-white to-purple-50 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
          Color Explorer
        </h2>
        <div className="flex items-center justify-center px-3 py-1 bg-white rounded-full shadow-sm">
          <span className="text-sm font-medium text-purple-600">Score: {score}/{colorChallenges.length}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Color Challenge
        </h3>
        <p className="text-center mb-2 text-gray-700">
          Can you find the color of a <span className="font-bold">{challenge.object}</span>?
        </p>
      </div>
      
      {/* Color display area with animations */}
      <div className="relative mb-6 h-60 rounded-xl overflow-hidden" ref={colorDisplayRef}>
        <div 
          className={`absolute inset-0 ${challenge.background} transition-transform duration-500 ${
            gameState === "correct" ? "scale-105" : gameState === "incorrect" ? "scale-95" : ""
          }`}
        ></div>
        
        <ColorAnimation 
          color={challenge.color} 
          isPlaying={showAnimation} 
          isCorrect={gameState === "correct"} 
        />
        
        {showHint && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
            <p className="text-4xl font-bold text-white tracking-widest">
              {challenge.color[0].toUpperCase() + "..."}
            </p>
          </div>
        )}
        
        {/* Central icon indicating state */}
        <div className="absolute inset-0 flex items-center justify-center">
          {gameState === "correct" && (
            <Sparkles className="w-24 h-24 text-white animate-ping" />
          )}
          {gameState === "playing" && !showHint && (
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-2">Say the color!</p>
              <p className="text-white text-opacity-80">What color do you see?</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress indicators */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {colorChallenges.map((challenge, idx) => (
          <div 
            key={idx}
            className={`w-6 h-6 rounded-full transition-all ${
              completedColors.includes(challenge.color) 
                ? challenge.background 
                : "bg-gray-200"
            } ${
              idx === currentChallenge && "ring-2 ring-offset-2 ring-primary"
            }`}
          />
        ))}
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onClick={() => (isListening ? stopListening() : startListening())}
            className={`flex-1 ${isListening ? "bg-secondary" : "bg-primary"} relative overflow-hidden`}
            disabled={gameState !== "playing"}
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
              "Say the Color!"
            )}
          </Button>
          
          <Button variant="outline" onClick={speakClue} className="flex-shrink-0">
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowHint(!showHint)}
            className="flex items-center justify-center gap-1"
          >
            <span>{showHint ? "Hide Hint" : "Show Hint"}</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetGame}
            className="flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            <span>New Game</span>
          </Button>
        </div>
      </div>
      
      {transcript && (
        <p className="text-center mt-3 text-sm text-gray-600 bg-white p-2 rounded">
          I heard: <span className="font-medium">{transcript}</span>
        </p>
      )}
      
      {/* Educational content */}
      {gameState === "correct" && (
        <div className="mt-4 bg-white/80 p-3 rounded-lg border border-primary/20 animate-fade-in">
          <p className="text-sm text-gray-700">{challenge.funFact}</p>
        </div>
      )}
    </Card>
  );
}
