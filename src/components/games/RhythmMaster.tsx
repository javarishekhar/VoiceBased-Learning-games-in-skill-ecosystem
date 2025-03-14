
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Music, Volume2, Award, Star, RefreshCw } from "lucide-react";

// Types for rhythm sequences
interface Note {
  name: string;
  sound: string;
}

interface Level {
  id: number;
  notes: Note[];
  length: number;
  tempo: number;
}

// Musical notes and sounds
const notes: Record<string, Note> = {
  do: { name: "Do", sound: "do" },
  re: { name: "Re", sound: "re" },
  mi: { name: "Mi", sound: "mi" },
  fa: { name: "Fa", sound: "fa" },
  sol: { name: "Sol", sound: "sol" },
  la: { name: "La", sound: "la" },
  ti: { name: "Ti", sound: "ti" }
};

// Game levels with increasing difficulty
const levels: Level[] = [
  { id: 1, notes: [notes.do, notes.re, notes.mi], length: 3, tempo: 1000 },
  { id: 2, notes: [notes.do, notes.re, notes.mi, notes.fa], length: 3, tempo: 900 },
  { id: 3, notes: [notes.do, notes.re, notes.mi, notes.fa, notes.sol], length: 4, tempo: 800 },
  { id: 4, notes: [notes.do, notes.re, notes.mi, notes.fa, notes.sol, notes.la], length: 4, tempo: 700 },
  { id: 5, notes: [notes.do, notes.re, notes.mi, notes.fa, notes.sol, notes.la, notes.ti], length: 5, tempo: 600 }
];

export function RhythmMaster() {
  const [currentLevel, setCurrentLevel] = useState(0); // 0 is the menu, 1+ are levels
  const [currentSequence, setCurrentSequence] = useState<Note[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Note[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [stars, setStars] = useState(0);
  const [instruments, setInstruments] = useState(["piano"]);
  const [currentInstrument, setCurrentInstrument] = useState("piano");
  const [isExplaining, setIsExplaining] = useState(false);
  
  const { transcript, isListening, startListening, stopListening, clearTranscript } = useVoice();
  const { toast } = useToast();
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Generate a new rhythm sequence based on the current level
  const generateSequence = () => {
    if (currentLevel === 0) return;
    
    const level = levels[currentLevel - 1];
    const newSequence: Note[] = [];
    
    for (let i = 0; i < level.length; i++) {
      const randomIndex = Math.floor(Math.random() * level.notes.length);
      newSequence.push(level.notes[randomIndex]);
    }
    
    setCurrentSequence(newSequence);
    return newSequence;
  };

  // Play the current sequence to the user
  const playSequence = (sequence = currentSequence) => {
    setIsPlaying(true);
    setIsPlayerTurn(false);
    
    // Stop any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    if (sequence.length === 0) {
      setIsPlaying(false);
      setIsPlayerTurn(true);
      startListening();
      return;
    }
    
    // Prepare the sequence as a text string for speech
    let sequenceText = sequence.map(note => note.sound).join(" ");
    speakText(sequenceText);
    
    // Calculate when to finish playing based on tempo
    const level = levels[currentLevel - 1];
    const playTime = sequence.length * level.tempo;
    
    setTimeout(() => {
      setIsPlaying(false);
      setIsPlayerTurn(true);
      clearTranscript();
      startListening();
      toast({
        title: "Your Turn!",
        description: "Repeat the rhythm pattern",
      });
    }, playTime + 500); // Add a small buffer
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slower for clear notes
    utterance.pitch = 1.2; // Slightly higher pitch for musical tones
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

  // Start a level
  const startLevel = (level: number) => {
    if (level > unlockedLevels) {
      toast({
        title: "Level Locked",
        description: "Complete earlier levels to unlock this one!",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentLevel(level);
    setPlayerSequence([]);
    const newSequence = generateSequence();
    
    // Introduction to the level
    const levelIntro = `Level ${level}. Listen carefully to the rhythm pattern.`;
    speakText(levelIntro);
    
    // Play the sequence after the intro
    setTimeout(() => {
      playSequence(newSequence);
    }, 2500);
  };

  // Process voice input from the player
  useEffect(() => {
    if (transcript && isListening && isPlayerTurn && currentLevel > 0) {
      stopListening();
      
      // Process the player's input
      const playerInput = transcript.toLowerCase().trim();
      console.log("Player input:", playerInput);
      
      // Compare with the expected sequence
      const expectedSequence = currentSequence.map(note => note.sound).join(" ");
      const isCorrect = playerInput.includes(expectedSequence);
      
      if (isCorrect) {
        // Success - correct pattern
        toast({
          title: "Great job!",
          description: "You matched the rhythm perfectly!",
        });
        
        // Add a star and potentially unlock the next level
        setStars(prev => prev + 1);
        if (stars + 1 >= currentLevel * 3 && currentLevel === unlockedLevels && unlockedLevels < levels.length) {
          setUnlockedLevels(prev => prev + 1);
          // Check if new instrument unlocked
          if ((stars + 1) % 5 === 0) {
            const newInstruments = [...instruments];
            if (!newInstruments.includes("guitar") && stars + 1 >= 5) {
              newInstruments.push("guitar");
              toast({
                title: "New Instrument Unlocked!",
                description: "You've unlocked the Guitar instrument!",
              });
            } else if (!newInstruments.includes("drums") && stars + 1 >= 10) {
              newInstruments.push("drums");
              toast({
                title: "New Instrument Unlocked!",
                description: "You've unlocked the Drums instrument!",
              });
            } else if (!newInstruments.includes("flute") && stars + 1 >= 15) {
              newInstruments.push("flute");
              toast({
                title: "New Instrument Unlocked!",
                description: "You've unlocked the Flute instrument!",
              });
            }
            setInstruments(newInstruments);
          }
        }
        
        // Generate a new sequence after success
        setTimeout(() => {
          const newSequence = generateSequence();
          playSequence(newSequence);
        }, 1500);
        
      } else {
        // Failure - incorrect pattern
        toast({
          title: "Try Again",
          description: `The pattern was "${expectedSequence}". Let's try once more.`,
          variant: "destructive",
        });
        
        // Replay the same sequence
        setTimeout(() => {
          playSequence();
        }, 2000);
      }
    }
  }, [transcript, isListening, isPlayerTurn, currentLevel, currentSequence, toast, stopListening, stars, unlockedLevels, instruments]);

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Music className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Rhythm Master</h2>
      </div>
      
      {currentLevel === 0 ? (
        <div className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Listen carefully to the musical pattern</li>
              <li>When it's your turn, repeat the notes you heard</li>
              <li>Say the notes out loud (like "do re mi")</li>
              <li>Earn stars to unlock new levels and instruments</li>
            </ol>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold mb-2">Choose a Level</h3>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((level) => (
                  <Button
                    key={level.id}
                    onClick={() => startLevel(level.id)}
                    disabled={level.id > unlockedLevels}
                    className={level.id <= unlockedLevels ? "bg-primary" : "bg-gray-200"}
                  >
                    {level.id}
                    {level.id > unlockedLevels && <span className="ml-1">🔒</span>}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Choose an Instrument</h3>
              <div className="space-y-2">
                {["piano", "guitar", "drums", "flute"].map((instrument) => (
                  <Button
                    key={instrument}
                    onClick={() => setCurrentInstrument(instrument)}
                    disabled={!instruments.includes(instrument)}
                    variant={currentInstrument === instrument ? "default" : "outline"}
                    className="w-full capitalize"
                  >
                    {instrument}
                    {!instruments.includes(instrument) && <span className="ml-1">🔒</span>}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-primary/5 p-4 rounded-lg">
            <div>
              <h3 className="font-semibold">Your Progress</h3>
              <p className="text-sm">Unlock all levels and instruments!</p>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg font-bold">{stars}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Level {currentLevel}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg font-bold">{stars}</span>
            </div>
          </div>
          
          <div className="relative bg-primary/5 p-6 rounded-lg min-h-[150px] flex items-center justify-center">
            {isPlaying ? (
              <div className="text-center animate-pulse">
                <Music className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-lg font-medium">Playing sequence...</p>
                <p className="text-sm">Listen carefully!</p>
              </div>
            ) : isPlayerTurn ? (
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Your turn!</p>
                <p className="text-sm">Repeat what you heard</p>
                {isListening && (
                  <div className="mt-4 animate-pulse">
                    <p className="text-primary">Listening...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-medium">Get ready!</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button
                onClick={() => isPlayerTurn ? playSequence() : null}
                disabled={isPlaying || !isPlayerTurn}
                variant="outline"
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Hear Again
              </Button>
              
              {isExplaining && (
                <Button
                  onClick={stopSpeaking}
                  variant="outline"
                >
                  Stop Sound
                </Button>
              )}
            </div>
            
            <div className="space-x-2">
              <Button
                onClick={() => startLevel(currentLevel)}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Restart
              </Button>
              
              <Button
                onClick={() => setCurrentLevel(0)}
                variant="outline"
              >
                Back to Menu
              </Button>
            </div>
          </div>
          
          {isPlayerTurn && transcript && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <p className="font-medium">Heard: {transcript}</p>
            </div>
          )}
          
          <div className="grid grid-cols-7 gap-1 mt-4">
            {Object.values(notes).map((note) => (
              <div 
                key={note.name}
                className="text-center p-2 bg-primary/10 rounded text-primary font-medium"
              >
                {note.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
