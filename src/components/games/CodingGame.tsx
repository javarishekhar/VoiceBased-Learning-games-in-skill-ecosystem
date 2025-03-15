
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useVoice } from "@/contexts/VoiceContext";
import { CheckCircle, Code, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const CODING_CHALLENGES = [
  {
    id: 1,
    title: "Print Hello World",
    description: "Write a line of code that prints 'Hello World' to the console.",
    expectedSolution: "console.log('Hello World');",
    hint: "Use console.log() to print to the console.",
  },
  {
    id: 2,
    title: "Create a Variable",
    description: "Create a variable named 'age' and assign it the value 10.",
    expectedSolution: "let age = 10;",
    hint: "Use 'let' or 'const' to declare a variable.",
  },
  {
    id: 3,
    title: "Write a Function",
    description: "Write a function named 'add' that takes two parameters and returns their sum.",
    expectedSolution: "function add(a, b) { return a + b; }",
    hint: "Use the 'function' keyword followed by the function name and parameters.",
  },
];

const CodingGame = () => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userSolution, setUserSolution] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const { transcript, isListening, startListening, stopListening } = useVoice();

  const currentChallenge = CODING_CHALLENGES[currentChallengeIndex];

  useEffect(() => {
    if (isListening && transcript) {
      // Process voice commands
      const command = transcript.toLowerCase();
      
      if (command.includes("next challenge") || command.includes("next question")) {
        goToNextChallenge();
      } else if (command.includes("previous challenge") || command.includes("previous question")) {
        goToPreviousChallenge();
      } else if (command.includes("show hint") || command.includes("give hint")) {
        setShowHint(true);
      } else if (command.includes("hide hint")) {
        setShowHint(false);
      } else if (command.includes("check solution") || command.includes("submit solution")) {
        checkSolution();
      } else if (command.includes("write")) {
        // Try to extract code from voice command
        const codeMatch = command.match(/write\s+(.*)/i);
        if (codeMatch && codeMatch[1]) {
          setUserSolution(codeMatch[1]);
        }
      }
    }
  }, [transcript, isListening]);

  const checkSolution = () => {
    const solution = userSolution.trim();
    const expected = currentChallenge.expectedSolution.trim();

    if (solution === expected || solution.replace(/\s+/g, "") === expected.replace(/\s+/g, "")) {
      setFeedback({
        type: "success",
        message: "Great job! Your solution is correct!",
      });
      
      if (!completedChallenges.includes(currentChallenge.id)) {
        setCompletedChallenges([...completedChallenges, currentChallenge.id]);
        
        // Trigger confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      setFeedback({
        type: "error",
        message: "Your solution is not quite right. Try again!",
      });
    }
  };

  const goToNextChallenge = () => {
    if (currentChallengeIndex < CODING_CHALLENGES.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setUserSolution("");
      setFeedback({ type: null, message: "" });
      setShowHint(false);
    }
  };

  const goToPreviousChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
      setUserSolution("");
      setFeedback({ type: null, message: "" });
      setShowHint(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="text-primary h-6 w-6" />
          <span>Coding Challenge {currentChallengeIndex + 1}/{CODING_CHALLENGES.length}</span>
        </CardTitle>
        <CardDescription>
          Learn to code with voice commands. Say "next challenge", "show hint", or "check solution".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          key={currentChallenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-bold text-lg mb-2">{currentChallenge.title}</h3>
            <p>{currentChallenge.description}</p>
          </div>
          
          {showHint && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle>Hint</AlertTitle>
              <AlertDescription>{currentChallenge.hint}</AlertDescription>
            </Alert>
          )}
          
          <div className="relative">
            <textarea
              value={userSolution}
              onChange={(e) => setUserSolution(e.target.value)}
              className="w-full h-32 p-4 font-mono text-sm rounded-md border border-gray-300 bg-gray-50"
              placeholder="Write your solution here..."
            />
            {completedChallenges.includes(currentChallenge.id) && (
              <div className="absolute top-2 right-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          
          {feedback.type && (
            <Alert className={`${
              feedback.type === "success" ? "bg-green-50 border-green-200" : 
              feedback.type === "error" ? "bg-red-50 border-red-200" : 
              "bg-blue-50 border-blue-200"
            }`}>
              {feedback.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}
        </motion.div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button 
            variant="outline" 
            onClick={goToPreviousChallenge}
            disabled={currentChallengeIndex === 0}
          >
            Previous
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
          <Button onClick={checkSolution}>Check Solution</Button>
          <Button 
            variant="default" 
            onClick={goToNextChallenge}
            disabled={currentChallengeIndex === CODING_CHALLENGES.length - 1}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CodingGame;
