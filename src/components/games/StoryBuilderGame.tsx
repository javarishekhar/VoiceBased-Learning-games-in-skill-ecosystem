
import React, { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Book, BookOpen, Star, Sparkles, RefreshCw } from "lucide-react";

// Story starter prompts with matching images
const storyStarters = [
  {
    prompt: "A little cat found a magical door. What happens next?",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format",
    theme: "adventure"
  },
  {
    prompt: "Once upon a time, a child discovered they could fly. Where did they go?",
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600&auto=format",
    theme: "fantasy"
  },
  {
    prompt: "The small robot woke up in a strange forest. What did it see?",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format",
    theme: "scifi"
  },
  {
    prompt: "A treasure map appeared on the kitchen table. Who put it there?",
    image: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?w=600&auto=format",
    theme: "mystery"
  },
  {
    prompt: "The friendly dinosaur wanted to make friends. How did it try?",
    image: "https://images.unsplash.com/photo-1519365081044-6d0f698e90ef?w=600&auto=format",
    theme: "friendship"
  }
];

// Animation for story transitions
const StoryAnimation = ({ isPlaying, theme }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let particleCount = 50;
    let particles = [];
    
    // Get theme-specific colors
    const getThemeColors = () => {
      switch(theme) {
        case 'adventure': return ['#FFD700', '#FF6347', '#FF4500'];
        case 'fantasy': return ['#9370DB', '#8A2BE2', '#9400D3'];
        case 'scifi': return ['#00BFFF', '#1E90FF', '#4169E1'];
        case 'mystery': return ['#9932CC', '#8B008B', '#800080'];
        case 'friendship': return ['#32CD32', '#3CB371', '#2E8B57'];
        default: return ['#FFD700', '#FF6347', '#87CEEB'];
      }
    };
    
    const colors = getThemeColors();
    
    // Create particles
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 3 + 1,
          direction: Math.random() * Math.PI * 2
        });
      }
    };
    
    createParticles();
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Move particles
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Wrap around canvas edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      particles = [];
    };
  }, [isPlaying, theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={200}
      className="absolute inset-0 w-full h-full"
    />
  );
};

export function StoryBuilderGame() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(true);
  const [aiResponse, setAiResponse] = useState("");
  const { transcript, isListening, startListening, stopListening, clearTranscript } = useVoice();
  const { toast } = useToast();

  // Function to generate AI response based on child's input
  const generateStoryResponse = (childInput) => {
    // In a real app, this could call an API like OpenAI
    // For now, we'll use simple pattern matching
    const input = childInput.toLowerCase();
    
    // Custom responses based on common keywords
    if (input.includes("treasure") || input.includes("gold") || input.includes("find")) {
      return "They found a chest filled with golden toys! The toys started to float and dance in the air.";
    } else if (input.includes("friend") || input.includes("play") || input.includes("together")) {
      return "They made a new friend who showed them a secret hideout with magical games that came to life!";
    } else if (input.includes("magic") || input.includes("spell") || input.includes("wizard")) {
      return "Suddenly, colorful sparkles filled the air and everything around them began to transform!";
    } else if (input.includes("adventure") || input.includes("journey") || input.includes("travel")) {
      return "They embarked on an amazing journey across mountains and valleys, meeting helpful creatures along the way.";
    } else if (input.includes("scary") || input.includes("monster") || input.includes("afraid")) {
      return "But they soon discovered that what seemed scary was actually friendly and needed their help!";
    } else {
      // Generic responses that can work with any input
      const responses = [
        "What an amazing idea! Then, a rainbow appeared in the sky, leading them to a garden of talking flowers.",
        "Wow! And just then, they heard gentle music coming from beyond the hills.",
        "That's so creative! As they continued their adventure, they discovered a tiny door hidden behind some leaves.",
        "Brilliant! The sky suddenly turned purple, and stars began to dance around them.",
        "Great thinking! They found a magical key that fit perfectly into a lock they found nearby."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  // Process the user's speech input
  useEffect(() => {
    if (transcript && isListening && waitingForInput) {
      console.log("Processing story input:", transcript);
      
      if (transcript.length > 10) {  // Ensure we have a meaningful input
        stopListening();
        setWaitingForInput(false);
        
        // Play animation while "thinking"
        setIsAnimating(true);
        
        // Store child's input in story progress
        const updatedStory = [...storyProgress, transcript];
        setStoryProgress(updatedStory);
        
        // Generate AI response with a slight delay to simulate thinking
        setTimeout(() => {
          const response = generateStoryResponse(transcript);
          setAiResponse(response);
          
          // Stop animation
          setIsAnimating(false);
          
          // Add AI response to story progress
          setStoryProgress([...updatedStory, response]);
          
          // Show toast
          toast({
            title: "Story continues!",
            description: "What happens next? It's your turn!",
          });
          
          // Reset for next input
          clearTranscript();
          setWaitingForInput(true);
        }, 2000);
      }
    }
  }, [transcript, isListening, stopListening, waitingForInput, storyProgress, toast, clearTranscript]);

  // Function to start a new story
  const startNewStory = () => {
    const newIndex = (storyIndex + 1) % storyStarters.length;
    setStoryIndex(newIndex);
    setStoryProgress([storyStarters[newIndex].prompt]);
    setAiResponse("");
    setWaitingForInput(true);
    toast({
      title: "New Story Started",
      description: "Listen to the beginning and continue the story!",
    });
  };

  // Read the story aloud
  const readStoryAloud = () => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance with the full story
      const utterance = new SpeechSynthesisUtterance(storyProgress.join(" "));
      utterance.rate = 0.9;  // Slightly slower for kids
      utterance.pitch = 1.1;  // Slightly higher pitch
      
      // Speak
      window.speechSynthesis.speak(utterance);
    }
  };

  // Initialize with first story
  useEffect(() => {
    setStoryProgress([storyStarters[0].prompt]);
  }, []);

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary" />
        Story Builder
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">How to Play</h3>
        <p className="text-sm text-gray-600">
          Listen to the start of the story, then use your voice to continue it! 
          Say what happens next, and the story will grow with your ideas.
        </p>
      </div>

      {/* Story visualization */}
      <div className="relative mb-6 rounded-lg overflow-hidden h-60 bg-gray-100">
        {isAnimating && (
          <StoryAnimation isPlaying={isAnimating} theme={storyStarters[storyIndex].theme} />
        )}
        <img 
          src={storyStarters[storyIndex].image} 
          alt="Story visualization" 
          className={`w-full h-full object-cover transition-opacity duration-300 ${isAnimating ? 'opacity-60' : 'opacity-100'}`}
        />
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-20 h-20 text-primary animate-pulse" />
          </div>
        )}
      </div>

      {/* Story progress */}
      <div className="mb-6 bg-primary/5 p-4 rounded-lg max-h-56 overflow-y-auto">
        {storyProgress.map((part, idx) => (
          <p key={idx} className={`mb-2 ${idx % 2 === 0 ? 'text-primary font-medium' : 'text-gray-700 italic pl-4 border-l-2 border-primary'}`}>
            {part}
          </p>
        ))}
        
        {waitingForInput && isListening && (
          <div className="flex items-center text-gray-500 italic">
            <span className="mr-2">Your turn...</span>
            <span className="flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>•</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button 
            onClick={() => waitingForInput ? (isListening ? stopListening() : startListening()) : null}
            disabled={!waitingForInput}
            className={`flex-1 ${isListening ? "bg-secondary" : "bg-primary"}`}
          >
            {isListening ? "I'm Listening..." : "Tell Your Part!"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={readStoryAloud}
            className="flex-1"
          >
            <Book className="w-4 h-4 mr-1" /> Read Story
          </Button>
        </div>
        
        <Button 
          variant="secondary" 
          onClick={startNewStory}
          className="flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4 mr-1" /> New Story
        </Button>
      </div>

      {transcript && isListening && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">I heard: "{transcript}"</p>
        </div>
      )}
      
      {/* Storytelling badges to encourage kids */}
      {storyProgress.length > 3 && (
        <div className="mt-6 flex justify-center">
          <div className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-semibold text-primary">Storyteller Badge Earned!</span>
          </div>
        </div>
      )}
    </Card>
  );
}
