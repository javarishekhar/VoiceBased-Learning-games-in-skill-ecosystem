
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Volume2, Star, RefreshCw } from "lucide-react";

// Story prompts for different age groups
const storyPrompts = {
  young: [
    "A little cat found a magical door. What happens next?",
    "The friendly robot woke up in a garden. What did it see?",
    "The tiny bird couldn't find its nest. Where did it look?",
    "Max found a glowing stone at the beach. What did he do?",
    "The teddy bear came to life when everyone was sleeping. What did it do?",
  ],
  middle: [
    "Deep in the forest, a child discovered a hidden cottage. Who lived there?",
    "One morning, all the adults in town disappeared. What happened next?",
    "The old treasure map led them to a strange cave. What was inside?", 
    "When the storm cleared, a rainbow bridge appeared in the sky. Where did it lead?",
    "The old toy box in the attic started making sounds at night. Why?",
  ],
  older: [
    "The mysterious new student could do things nobody else could. What was their secret?",
    "The abandoned spaceship sent out a signal after 100 years. What message did it contain?",
    "During the school field trip, time suddenly stopped for everyone except you. What did you do?",
    "The ancient book from the library began writing its own pages. What story was it telling?",
    "When they woke up, their small town was surrounded by an invisible wall. How did they escape?",
  ]
};

// Story starters for AI to begin stories
const storyStarters = [
  "Once upon a time, ",
  "In a magical land far away, ",
  "Long ago, in a small village, ",
  "On a bright sunny day, ",
  "Deep in the enchanted forest, ",
  "In a world where animals could talk, ",
  "When the stars aligned one special night, ",
  "Under the sparkling ocean waves, ",
  "In a kingdom high among the clouds, ",
  "At the edge of the universe, ",
];

export function StoryBuilder() {
  const [ageGroup, setAgeGroup] = useState("young");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const { transcript, isListening, startListening, stopListening, clearTranscript } = useVoice();
  const { toast } = useToast();
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize or reset the story
  const startNewStory = () => {
    // Stop any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    // Select random prompt based on age group
    const prompts = storyPrompts[ageGroup as keyof typeof storyPrompts];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    
    // Select random story starter
    const starter = storyStarters[Math.floor(Math.random() * storyStarters.length)];
    setStoryHistory([starter]);
    
    // Start the story
    setIsStarted(true);
    speakText(starter + " " + randomPrompt);
    setIsWaitingForInput(true);
  };

  // Handle voice input for the story
  useEffect(() => {
    if (transcript && isListening && isWaitingForInput) {
      // Stop listening once we have input
      stopListening();
      setIsWaitingForInput(false);
      
      // Add the child's input to the story
      const newPart = transcript.trim();
      setStoryHistory(prev => [...prev, newPart]);
      
      // Generate AI continuation
      setTimeout(() => {
        generateAIContinuation(newPart);
      }, 1000);
    }
  }, [transcript, isListening, isWaitingForInput, stopListening]);

  // Generate AI continuation of the story
  const generateAIContinuation = (userInput: string) => {
    // Simple AI continuations based on keywords in the user's input
    let aiResponse = "";
    const input = userInput.toLowerCase();
    
    if (input.includes("magic") || input.includes("magical") || input.includes("spell")) {
      aiResponse = "Suddenly, sparkles filled the air and everything began to glow with magical light!";
    } else if (input.includes("friend") || input.includes("together")) {
      aiResponse = "They became the best of friends and decided to go on an adventure together.";
    } else if (input.includes("scary") || input.includes("afraid") || input.includes("fear")) {
      aiResponse = "Though it was a little scary, they found the courage to keep going forward.";
    } else if (input.includes("treasure") || input.includes("gold") || input.includes("find")) {
      aiResponse = "To their surprise, they discovered a hidden treasure that nobody had seen before!";
    } else if (input.includes("home") || input.includes("return")) {
      aiResponse = "The journey was long, but they finally found their way back home, bringing amazing stories with them.";
    } else {
      // Default continuations if no keywords match
      const continuations = [
        "What an amazing idea! And then, ",
        "That's so creative! After that, ",
        "Wow! And just when they thought it was over, ",
        "How exciting! Then suddenly, ",
        "That's a great part of the story! Next, "
      ];
      aiResponse = continuations[Math.floor(Math.random() * continuations.length)];
    }
    
    // Add the AI response to the story
    setStoryHistory(prev => [...prev, aiResponse]);
    
    // Speak the AI response
    speakText(aiResponse);
    
    // Wait for the next user input
    setTimeout(() => {
      setIsWaitingForInput(true);
      startListening();
    }, 1000);
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch for engaging tone
    utteranceRef.current = utterance;
    
    setIsExplaining(true);
    utterance.onend = () => {
      setIsExplaining(false);
    };
    
    synth.speak(utterance);
  };

  // Stop the current speech
  const stopSpeaking = () => {
    if (synth.speaking) {
      synth.cancel();
      setIsExplaining(false);
    }
  };

  // Finish the story
  const finishStory = () => {
    if (synth.speaking) {
      synth.cancel();
    }
    
    const endings = [
      "And they all lived happily ever after!",
      "It was the most amazing adventure they ever had!",
      "They learned that friendship is the greatest magic of all!",
      "And that's how they saved the day!",
      "The end... or is it just the beginning?"
    ];
    
    const ending = endings[Math.floor(Math.random() * endings.length)];
    setStoryHistory(prev => [...prev, ending]);
    speakText(ending);
    setIsWaitingForInput(false);
    setIsStarted(false);
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Story Builder</h2>
      </div>
      
      {!isStarted ? (
        <div className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Choose Age Group</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={ageGroup === "young" ? "default" : "outline"}
                onClick={() => setAgeGroup("young")}
                className="flex-1"
              >
                Young (3-5)
              </Button>
              <Button
                variant={ageGroup === "middle" ? "default" : "outline"}
                onClick={() => setAgeGroup("middle")}
                className="flex-1"
              >
                Middle (6-8)
              </Button>
              <Button
                variant={ageGroup === "older" ? "default" : "outline"}
                onClick={() => setAgeGroup("older")}
                className="flex-1"
              >
                Older (9-12)
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={startNewStory}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              Start a New Story
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {currentPrompt && (
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Your Prompt</h3>
              <p>{currentPrompt}</p>
            </div>
          )}
          
          <div className="border rounded-lg p-4 min-h-[200px] bg-white">
            <h3 className="font-semibold mb-2">Our Story</h3>
            <div className="space-y-4">
              {storyHistory.map((part, index) => (
                <p key={index} className={`${index % 2 === 0 ? "text-primary" : "text-secondary"}`}>
                  {part}
                </p>
              ))}
              {isWaitingForInput && <p className="text-gray-400 italic">Waiting for your part of the story...</p>}
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button
                onClick={() => isWaitingForInput ? stopListening() : startListening()}
                disabled={isExplaining}
                className={`${isWaitingForInput && isListening ? "bg-secondary" : "bg-primary"} hover:bg-opacity-90`}
              >
                {isWaitingForInput && isListening ? "Stop Speaking" : "Start Speaking"}
              </Button>
              
              {isExplaining && (
                <Button
                  onClick={stopSpeaking}
                  variant="outline"
                >
                  Stop Narration
                </Button>
              )}
            </div>
            
            <div className="space-x-2">
              <Button
                onClick={finishStory}
                variant="outline"
              >
                Finish Story
              </Button>
              
              <Button
                onClick={startNewStory}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                New Story
              </Button>
            </div>
          </div>
          
          {isWaitingForInput && transcript && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <p className="font-medium">Heard: {transcript}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
