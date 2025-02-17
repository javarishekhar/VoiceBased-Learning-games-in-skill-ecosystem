
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

const quizSections = {
  currentAffairs: {
    title: "Current Affairs",
    questions: [
      {
        question: "Who is the current Prime Minister of India?",
        options: ["Narendra Modi", "Rahul Gandhi", "Amit Shah", "Yogi Adityanath"],
        correctAnswer: "Narendra Modi",
      },
      // Add more current affairs questions...
    ]
  },
  technical: {
    title: "Technical Questions",
    questions: [
      {
        question: "What is the main purpose of a firewall in computer networks?",
        options: ["Network Security", "Data Storage", "Processing Speed", "Power Management"],
        correctAnswer: "Network Security",
      },
      // Add more technical questions...
    ]
  },
  aptitude: {
    title: "Aptitude and Reasoning",
    questions: [
      {
        question: "If 5 + 3 = 28, 6 + 4 = 40, then 7 + 5 = ?",
        options: ["52", "54", "56", "58"],
        correctAnswer: "54",
      },
      // Add more aptitude questions...
    ]
  },
  science: {
    title: "General Science",
    questions: [
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
      },
      // Add more science questions...
    ]
  },
  programming: {
    title: "Programming Languages",
    questions: [
      {
        question: "Which language is commonly used for web development?",
        options: ["JavaScript", "C++", "Swift", "Rust"],
        correctAnswer: "JavaScript",
      },
      // Add more programming questions...
    ]
  }
};

export function QuizGame() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening && selectedSection) {
      const answer = transcript.toLowerCase().trim();
      const currentQuestions = quizSections[selectedSection].questions;
      const correctAnswer = currentQuestions[currentQuestion].correctAnswer.toLowerCase();
      
      if (answer === correctAnswer) {
        stopListening();
        toast({
          title: "Correct!",
          description: "Well done! Moving to next question...",
        });
        setScore((prev) => prev + 1);
        setTimeout(() => {
          if (currentQuestion < currentQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
          } else {
            setGameOver(true);
          }
        }, 1500);
      } else if (currentQuestions[currentQuestion].options.map(opt => opt.toLowerCase()).includes(answer)) {
        stopListening();
        toast({
          title: "Incorrect",
          description: `The correct answer was ${currentQuestions[currentQuestion].correctAnswer}`,
          variant: "destructive",
        });
        setTimeout(() => {
          if (currentQuestion < currentQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
          } else {
            setGameOver(true);
          }
        }, 1500);
      }
    }
  }, [transcript, currentQuestion, isListening, stopListening, toast, selectedSection]);

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameOver(false);
    setSelectedSection(null);
  };

  if (!selectedSection) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(quizSections).map(([key, section]) => (
          <Card 
            key={key} 
            className="p-4 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setSelectedSection(key)}
          >
            <h3 className="text-lg font-semibold text-center">{section.title}</h3>
            <p className="text-sm text-center text-gray-600 mt-2">
              {section.questions.length} questions
            </p>
          </Card>
        ))}
      </div>
    );
  }

  if (gameOver) {
    return (
      <Card className="p-6 max-w-lg mx-auto mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">Game Over!</h2>
        <p className="text-center mb-4">
          Your score: {score} out of {quizSections[selectedSection].questions.length}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={restartGame} className="bg-primary hover:bg-primary/90">
            Play Again
          </Button>
          <Button onClick={() => setSelectedSection(null)} variant="outline">
            Choose Another Section
          </Button>
        </div>
      </Card>
    );
  }

  const currentQuestions = quizSections[selectedSection].questions;

  return (
    <Card className="p-6 max-w-lg mx-auto mt-10">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm font-medium">
          Question {currentQuestion + 1}/{currentQuestions.length}
        </span>
        <span className="text-sm font-medium">Score: {score}</span>
      </div>
      
      <h2 className="text-xl font-bold mb-4">
        {currentQuestions[currentQuestion].question}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {currentQuestions[currentQuestion].options.map((option, index) => (
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
          className={`${isListening ? "bg-secondary" : "bg-primary"} hover:bg-opacity-90`}
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
