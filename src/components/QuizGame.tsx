import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
];

export function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const answer = transcript.toLowerCase().trim();
      const correctAnswer = questions[currentQuestion].correctAnswer.toLowerCase();
      
      if (answer === correctAnswer) {
        stopListening();
        toast({
          title: "Correct!",
          description: "Well done! Moving to next question...",
          variant: "default",
        });
        setScore((prev) => prev + 1);
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
          } else {
            setGameOver(true);
          }
        }, 1500);
      } else if (questions[currentQuestion].options.map(opt => opt.toLowerCase()).includes(answer)) {
        stopListening();
        toast({
          title: "Incorrect",
          description: `The correct answer was ${questions[currentQuestion].correctAnswer}`,
          variant: "destructive",
        });
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
          } else {
            setGameOver(true);
          }
        }, 1500);
      }
    }
  }, [transcript, currentQuestion, isListening, stopListening, toast]);

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <Card className="p-6 max-w-lg mx-auto mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">Game Over!</h2>
        <p className="text-center mb-4">
          Your score: {score} out of {questions.length}
        </p>
        <div className="flex justify-center">
          <Button onClick={restartGame} className="bg-primary hover:bg-primary/90">
            Play Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-lg mx-auto mt-10">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm font-medium">
          Question {currentQuestion + 1}/{questions.length}
        </span>
        <span className="text-sm font-medium">Score: {score}</span>
      </div>
      
      <h2 className="text-xl font-bold mb-4">
        {questions[currentQuestion].question}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {questions[currentQuestion].options.map((option, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer"
          >
            {option}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={`${
            isListening ? "bg-secondary" : "bg-primary"
          } hover:bg-opacity-90`}
        >
          {isListening ? "Stop Listening" : "Start Speaking"}
        </Button>
      </div>

      {isListening && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Listening... Say your answer!
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