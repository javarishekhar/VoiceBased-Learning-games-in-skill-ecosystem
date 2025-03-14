
import React, { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Music, Play, Pause, Volume2, Award, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

// Musical patterns with notes, visual representation and color themes
const musicalPatterns = [
  {
    level: 1,
    sequence: ["do", "re", "mi"],
    instrument: "piano",
    display: "Do Re Mi",
    colors: ["#FF5252", "#448AFF", "#66BB6A"],
    audioUrls: [
      "https://tonejs.github.io/audio/berklee/C4.mp3",
      "https://tonejs.github.io/audio/berklee/D4.mp3",
      "https://tonejs.github.io/audio/berklee/E4.mp3"
    ]
  },
  {
    level: 2,
    sequence: ["mi", "mi", "fa", "sol"],
    instrument: "xylophone",
    display: "Mi Mi Fa Sol",
    colors: ["#66BB6A", "#66BB6A", "#FFC107", "#FF9800"],
    audioUrls: [
      "https://tonejs.github.io/audio/berklee/E4.mp3",
      "https://tonejs.github.io/audio/berklee/E4.mp3",
      "https://tonejs.github.io/audio/berklee/F4.mp3",
      "https://tonejs.github.io/audio/berklee/G4.mp3"
    ]
  },
  {
    level: 3,
    sequence: ["do", "mi", "sol", "do high"],
    instrument: "bells",
    display: "Do Mi Sol Do(high)",
    colors: ["#FF5252", "#66BB6A", "#FF9800", "#FF5252"],
    audioUrls: [
      "https://tonejs.github.io/audio/berklee/C4.mp3",
      "https://tonejs.github.io/audio/berklee/E4.mp3",
      "https://tonejs.github.io/audio/berklee/G4.mp3",
      "https://tonejs.github.io/audio/berklee/C5.mp3"
    ]
  },
  {
    level: 4,
    sequence: ["sol", "fa", "mi", "re", "do"],
    instrument: "flute",
    display: "Sol Fa Mi Re Do",
    colors: ["#FF9800", "#FFC107", "#66BB6A", "#448AFF", "#FF5252"],
    audioUrls: [
      "https://tonejs.github.io/audio/berklee/G4.mp3",
      "https://tonejs.github.io/audio/berklee/F4.mp3",
      "https://tonejs.github.io/audio/berklee/E4.mp3",
      "https://tonejs.github.io/audio/berklee/D4.mp3",
      "https://tonejs.github.io/audio/berklee/C4.mp3"
    ]
  },
  {
    level: 5,
    sequence: ["do", "re", "mi", "fa", "sol", "fa", "mi", "re", "do"],
    instrument: "marimba",
    display: "Do Re Mi Fa Sol Fa Mi Re Do",
    colors: ["#FF5252", "#448AFF", "#66BB6A", "#FFC107", "#FF9800", "#FFC107", "#66BB6A", "#448AFF", "#FF5252"],
    audioUrls: [
      "https://tonejs.github.io/audio/berklee/C4.mp3",
      "https://tonejs.github.io/audio/berklee/D4.mp3",
      "https://tonejs.github.io/audio/berklee/E4.mp3",
      "https://tonejs.github.io/audio/berklee/F4.mp3",
      "https://tonejs.github.io/audio/berklee/G4.mp3",
      "https://tonejs.github.io/audio/berklee/F4.mp3",
      "https://tonejs.github.io/audio/berklee/E4.mp3",
      "https://tonejs.github.io/audio/berklee/D4.mp3",
      "https://tonejs.github.io/audio/berklee/C4.mp3"
    ]
  }
];

// Visual animation component for rhythm visualization
const RhythmVisualizer = ({ isPlaying, activeNoteIndex, pattern }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (!pattern) return;
    
    // Calculate dimensions
    const noteCount = pattern.sequence.length;
    const noteWidth = width / noteCount;
    const padding = 10;
    const noteDisplayWidth = noteWidth - padding * 2;
    
    // Draw note blocks
    pattern.sequence.forEach((note, index) => {
      const x = index * noteWidth + padding;
      const y = height * 0.2;
      const noteHeight = height * 0.6;
      
      // Draw note block
      ctx.fillStyle = index === activeNoteIndex && isPlaying 
        ? pattern.colors[index] 
        : `${pattern.colors[index]}77`; // Add transparency
      
      ctx.beginPath();
      ctx.roundRect(x, y, noteDisplayWidth, noteHeight, 10);
      ctx.fill();
      
      // Draw note label
      ctx.fillStyle = "#333";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(pattern.sequence[index].toUpperCase(), x + noteDisplayWidth / 2, y + noteHeight / 2);
      
      // Draw indicator
      if (index === activeNoteIndex && isPlaying) {
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x - 3, y - 3, noteDisplayWidth + 6, noteHeight + 6, 12);
        ctx.stroke();
      }
    });
  }, [isPlaying, activeNoteIndex, pattern]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={150}
      className="w-full border rounded-lg bg-white/60"
    />
  );
};

export function RhythmMasterGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState(-1);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isListeningForSequence, setIsListeningForSequence] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [unlockedInstruments, setUnlockedInstruments] = useState<string[]>(["piano"]);
  const [lastResult, setLastResult] = useState<"success" | "fail" | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const { transcript, isListening, startListening, stopListening, clearTranscript } = useVoice();
  const { toast } = useToast();

  // Play a sequence of notes
  const playSequence = (patternIndex = currentLevel) => {
    if (isPlaying) return;
    
    const pattern = musicalPatterns[patternIndex];
    setIsPlaying(true);
    setActiveNoteIndex(-1);
    
    let noteIndex = 0;
    const intervalTime = 800; // time between notes in ms
    
    // Function to play individual note
    const playNote = () => {
      if (noteIndex < pattern.sequence.length) {
        setActiveNoteIndex(noteIndex);
        
        // Play the audio
        if (audioRefs.current[noteIndex]) {
          audioRefs.current[noteIndex].currentTime = 0;
          audioRefs.current[noteIndex].play().catch(e => console.error("Audio play error:", e));
        }
        
        noteIndex++;
        setTimeout(playNote, intervalTime);
      } else {
        // End of sequence
        setActiveNoteIndex(-1);
        setIsPlaying(false);
      }
    };
    
    // Start playing
    playNote();
  };

  // Create audio elements for the current pattern
  useEffect(() => {
    const pattern = musicalPatterns[currentLevel];
    if (!pattern) return;
    
    // Create audio elements for each note
    audioRefs.current = pattern.audioUrls.map(url => {
      const audio = new Audio(url);
      audio.preload = "auto";
      return audio;
    });
    
    return () => {
      // Cleanup audio elements
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = "";
      });
      audioRefs.current = [];
    };
  }, [currentLevel]);

  // Listen for voice input to match the sequence
  useEffect(() => {
    if (transcript && isListening && isListeningForSequence) {
      const input = transcript.toLowerCase();
      console.log("Processing rhythm input:", input);
      
      // Convert transcript to note sequence
      let detectedNotes: string[] = [];
      
      // Look for note names in the input
      const noteRegex = /\b(do|re|mi|fa|sol|la|si|high|low)\b/gi;
      const matches = input.match(noteRegex);
      
      if (matches) {
        // Process the matches to create a sequence
        let i = 0;
        while (i < matches.length) {
          let note = matches[i].toLowerCase();
          
          // Handle modifiers like "high" or "low"
          if (i < matches.length - 1) {
            const nextWord = matches[i + 1].toLowerCase();
            if (nextWord === "high" || nextWord === "low") {
              note = `${note} ${nextWord}`;
              i += 2;
              continue;
            }
          }
          
          detectedNotes.push(note);
          i++;
        }
        
        console.log("Detected notes:", detectedNotes);
        
        // If we have enough notes, check the sequence
        if (detectedNotes.length > 0) {
          stopListening();
          setIsListeningForSequence(false);
          setPlayerSequence(detectedNotes);
          
          // Compare with the target sequence
          const currentPattern = musicalPatterns[currentLevel];
          const targetSequence = currentPattern.sequence;
          
          // Simple check - see if all notes are present in order
          // In a real app, this would use a more sophisticated matching algorithm
          let correctNotes = 0;
          for (let i = 0; i < Math.min(detectedNotes.length, targetSequence.length); i++) {
            if (detectedNotes[i].includes(targetSequence[i])) {
              correctNotes++;
            }
          }
          
          const sequenceAccuracy = correctNotes / targetSequence.length;
          
          if (sequenceAccuracy >= 0.7) {
            // Success - increase score and provide feedback
            setScore(prev => prev + Math.floor(100 * sequenceAccuracy));
            setFeedback("Great job! You matched the rhythm!");
            setLastResult("success");
            
            // Unlock instrument if not already unlocked
            if (!unlockedInstruments.includes(currentPattern.instrument)) {
              setUnlockedInstruments(prev => [...prev, currentPattern.instrument]);
              toast({
                title: "New Instrument Unlocked!",
                description: `You can now play with the ${currentPattern.instrument}!`,
              });
            }
            
            // Move to next level if available
            if (currentLevel < musicalPatterns.length - 1) {
              setTimeout(() => {
                setCurrentLevel(prev => prev + 1);
                setFeedback("");
                setLastResult(null);
                toast({
                  title: "Level Up!",
                  description: "You've advanced to the next rhythm pattern.",
                });
              }, 2000);
            } else {
              toast({
                title: "Congratulations!",
                description: "You've mastered all the rhythm patterns!",
              });
            }
          } else {
            // Failure - provide encouraging feedback
            setFeedback("Nice try! Let's hear the pattern again and try once more.");
            setLastResult("fail");
            
            // Play the sequence again after a short delay
            setTimeout(() => {
              playSequence();
              setFeedback("");
              setLastResult(null);
            }, 3000);
          }
        }
      }
    }
  }, [transcript, isListening, isListeningForSequence, currentLevel, stopListening, toast, unlockedInstruments]);

  // Start listening for player's rhythm
  const listenForPlayerRhythm = () => {
    if (isPlaying) return;
    
    setPlayerSequence([]);
    setFeedback("Now repeat the pattern with your voice!");
    setIsListeningForSequence(true);
    clearTranscript();
    startListening();
  };

  // Reset game to the first level
  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setFeedback("");
    setPlayerSequence([]);
    setLastResult(null);
    toast({
      title: "Game Reset",
      description: "Starting from the first rhythm pattern.",
    });
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Music className="w-6 h-6 text-primary" />
        Rhythm Master
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">How to Play</h3>
        <p className="text-sm text-gray-600">
          Listen to the musical pattern, then repeat it with your voice! 
          Say the notes like "Do Re Mi" in the same order you hear them.
        </p>
      </div>

      {/* Current level info */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600">Level {musicalPatterns[currentLevel].level}</span>
          <span className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary">
            {musicalPatterns[currentLevel].instrument}
          </span>
        </div>
        <div className="text-sm font-semibold">Score: {score}</div>
      </div>

      {/* Rhythm visualizer */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-center">
          {isPlaying ? "Listen Carefully..." : musicalPatterns[currentLevel].display}
        </h3>
        <RhythmVisualizer 
          isPlaying={isPlaying} 
          activeNoteIndex={activeNoteIndex} 
          pattern={musicalPatterns[currentLevel]} 
        />
      </div>

      {/* Audio elements - hidden */}
      <div className="hidden">
        {musicalPatterns[currentLevel].audioUrls.map((url, index) => (
          <audio key={`audio-${index}`} src={url} preload="auto" />
        ))}
      </div>

      {/* Feedback area */}
      {feedback && (
        <div className={`mb-6 p-3 rounded-lg flex items-center justify-center gap-2 
          ${lastResult === "success" ? "bg-green-100 text-green-800" : 
            lastResult === "fail" ? "bg-orange-100 text-orange-800" : 
            "bg-blue-100 text-blue-800"}`}>
          {lastResult === "success" && <CheckCircle2 className="w-5 h-5" />}
          {lastResult === "fail" && <XCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{feedback}</p>
        </div>
      )}

      {/* Player sequence display */}
      {playerSequence.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Your Sequence:</h3>
          <div className="flex flex-wrap gap-2">
            {playerSequence.map((note, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button 
            onClick={() => playSequence()}
            disabled={isPlaying}
            className="flex-1 flex items-center justify-center gap-1"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Playing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Play Pattern
              </>
            )}
          </Button>
          
          <Button 
            variant="secondary"
            onClick={listenForPlayerRhythm}
            disabled={isPlaying || isListeningForSequence}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <Volume2 className="w-4 h-4" /> Repeat Pattern
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={resetGame}
          className="flex items-center justify-center gap-1"
        >
          <RefreshCw className="w-4 h-4" /> Reset Game
        </Button>
      </div>

      {/* Listening indicator */}
      {isListening && isListeningForSequence && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Listening for your rhythm... Say the notes!
          </p>
          {transcript && (
            <p className="text-xs text-gray-500 mt-1">
              Heard: "{transcript}"
            </p>
          )}
        </div>
      )}
      
      {/* Unlocked instruments */}
      {unlockedInstruments.length > 1 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Award className="w-4 h-4 text-yellow-500" /> Unlocked Instruments:
          </h3>
          <div className="flex flex-wrap gap-2">
            {unlockedInstruments.map((instrument) => (
              <span 
                key={instrument} 
                className="px-2 py-1 bg-primary/10 rounded-full text-xs text-primary"
              >
                {instrument}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
