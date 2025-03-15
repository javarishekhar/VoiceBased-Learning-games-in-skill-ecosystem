
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ThumbsUp, Volume2, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

// Types for math questions
type Operation = "addition" | "subtraction" | "multiplication";
type Difficulty = "easy" | "medium" | "hard";
type MathQuestion = {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
};

// Function to generate a random math question
const generateQuestion = (difficulty: Difficulty, operation: Operation): MathQuestion => {
  let num1, num2;
  
  switch (difficulty) {
    case "easy":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      break;
    case "medium":
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      break;
  }
  
  // Ensure subtraction doesn't result in negative numbers
  if (operation === "subtraction" && num2 > num1) {
    [num1, num2] = [num2, num1];
  }
  
  let answer;
  switch (operation) {
    case "addition":
      answer = num1 + num2;
      break;
    case "subtraction":
      answer = num1 - num2;
      break;
    case "multiplication":
      answer = num1 * num2;
      break;
  }
  
  // Generate 3 wrong options
  const generateWrongOption = () => {
    const offset = Math.floor(Math.random() * 10) - 5;
    return answer + offset || answer + (offset === 0 ? 1 : offset);
  };
  
  let options = [answer];
  while (options.length < 4) {
    const wrongOption = generateWrongOption();
    if (!options.includes(wrongOption)) {
      options.push(wrongOption);
    }
  }
  
  // Shuffle options
  options = options.sort(() => Math.random() - 0.5);
  
  return { num1, num2, operation, answer, options };
};

const getOperationSymbol = (operation: Operation): string => {
  switch (operation) {
    case "addition": return "+";
    case "subtraction": return "-";
    case "multiplication": return "×";
  }
};

const speakQuestion = (question: MathQuestion) => {
  const operationText = {
    addition: "plus",
    subtraction: "minus",
    multiplication: "times"
  };
  
  return `What is ${question.num1} ${operationText[question.operation]} ${question.num2}?`;
};

export function MathGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [operation, setOperation] = useState<Operation>("addition");
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize the speech synthesis
  useEffect(() => {
    speechRef.current = new SpeechSynthesisUtterance();
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Generate a new question when the game starts or settings change
  useEffect(() => {
    generateNewQuestion();
  }, [difficulty, operation]);
  
  const generateNewQuestion = () => {
    const newQuestion = generateQuestion(difficulty, operation);
    setQuestion(newQuestion);
    setShowResult(false);
    setSelectedAnswer(null);
  };
  
  const speakText = (text: string) => {
    if (speechRef.current && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      speechRef.current.text = text;
      speechRef.current.rate = 0.9;
      window.speechSynthesis.speak(speechRef.current);
    }
  };
  
  const checkAnswer = (selectedOption: number) => {
    setSelectedAnswer(selectedOption);
    
    if (question && selectedOption === question.answer) {
      setIsCorrect(true);
      setScore(prevScore => prevScore + 1);
      setShowResult(true);
      
      // Play success sound
      if (audioRef.current) {
        audioRef.current.src = "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3";
        audioRef.current.play();
      }
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      speakText("Correct! Great job!");
    } else {
      setIsCorrect(false);
      setShowResult(true);
      
      // Play incorrect sound
      if (audioRef.current) {
        audioRef.current.src = "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3";
        audioRef.current.play();
      }
      
      speakText(`Incorrect. The correct answer is ${question?.answer}.`);
    }
    
    // Generate a new question after a delay
    setTimeout(() => {
      generateNewQuestion();
    }, 3000);
  };
  
  // Process voice commands
  useEffect(() => {
    if (transcript && isListening && question) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing math command:", command);
      
      // Check if the command contains one of the options
      const numberMatch = command.match(/\d+/);
      if (numberMatch) {
        const spokenNumber = parseInt(numberMatch[0], 10);
        console.log("Detected number:", spokenNumber);
        
        if (question.options.includes(spokenNumber)) {
          stopListening();
          checkAnswer(spokenNumber);
        }
      } else if (command.includes("repeat") || command.includes("say again")) {
        stopListening();
        speakText(speakQuestion(question));
      } else if (command.includes("new question") || command.includes("next")) {
        stopListening();
        generateNewQuestion();
      }
    }
  }, [transcript, isListening, stopListening, question]);
  
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    toast({
      title: "Difficulty Changed",
      description: `Difficulty set to ${newDifficulty}`,
      variant: "default",
    });
  };
  
  const handleOperationChange = (newOperation: Operation) => {
    setOperation(newOperation);
    toast({
      title: "Operation Changed",
      description: `Now practicing ${newOperation} problems`,
      variant: "default",
    });
  };
  
  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Calculator className="mr-2" /> Math Challenge
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Say the answer number to submit it</li>
          <li>• Say "Repeat" or "Say again" to hear the question</li>
          <li>• Say "New question" or "Next" for a new problem</li>
        </ul>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Difficulty</h3>
            <div className="flex space-x-2">
              <Button 
                variant={difficulty === "easy" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleDifficultyChange("easy")}
              >
                Easy
              </Button>
              <Button 
                variant={difficulty === "medium" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleDifficultyChange("medium")}
              >
                Medium
              </Button>
              <Button 
                variant={difficulty === "hard" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleDifficultyChange("hard")}
              >
                Hard
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Operation</h3>
            <div className="flex space-x-2">
              <Button 
                variant={operation === "addition" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleOperationChange("addition")}
              >
                Addition
              </Button>
              <Button 
                variant={operation === "subtraction" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleOperationChange("subtraction")}
              >
                Subtraction
              </Button>
              <Button 
                variant={operation === "multiplication" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleOperationChange("multiplication")}
              >
                Multiplication
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <div className="bg-primary/10 px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">Score: {score}</p>
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => speakText(question ? speakQuestion(question) : "")}
            className="flex items-center"
          >
            <Volume2 className="w-4 h-4 mr-2" /> Read Question
          </Button>
        </div>
      </div>
      
      {question && (
        <div className="mb-8">
          <div className="bg-primary/5 p-6 rounded-lg text-center mb-6">
            <motion.div
              key={`${question.num1}-${question.num2}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold"
            >
              {question.num1} {getOperationSymbol(question.operation)} {question.num2} = ?
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => checkAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg text-xl font-bold transition-all duration-200 ${
                  selectedAnswer === option 
                    ? (isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white") 
                    : (showResult && option === question.answer 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-100 hover:bg-primary hover:text-white")
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mt-4 p-3 rounded-lg text-center ${
                  isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                <p className="flex items-center justify-center">
                  {isCorrect ? (
                    <>
                      <ThumbsUp className="mr-2 w-5 h-5" /> 
                      Correct! Well done!
                    </>
                  ) : (
                    <>
                      The correct answer is {question.answer}
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <Button
          onClick={generateNewQuestion}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="mr-2 w-4 h-4" /> New Question
        </Button>
        
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={isListening ? "bg-secondary" : "bg-primary"}
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
          Listening... Say your answer!
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
      
      <audio ref={audioRef} />
    </Card>
  );
}
