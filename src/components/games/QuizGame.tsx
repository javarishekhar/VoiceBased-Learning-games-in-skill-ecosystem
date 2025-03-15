
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

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
      {
        question: "Which country hosted the 2023 G20 Summit?",
        options: ["India", "China", "USA", "Brazil"],
        correctAnswer: "India",
      },
      {
        question: "Who won the FIFA World Cup 2022?",
        options: ["Argentina", "France", "Brazil", "Germany"],
        correctAnswer: "Argentina",
      },
      {
        question: "Which country became the first to land on the Moon's south pole in 2023?",
        options: ["India", "China", "USA", "Russia"],
        correctAnswer: "India",
      },
      {
        question: "Who is the current Chief Justice of India?",
        options: ["DY Chandrachud", "NV Ramana", "SA Bobde", "Ranjan Gogoi"],
        correctAnswer: "DY Chandrachud",
      },
      {
        question: "Which Indian state was divided into two Union Territories in 2019?",
        options: ["Jammu and Kashmir", "Ladakh", "Telangana", "Andhra Pradesh"],
        correctAnswer: "Jammu and Kashmir",
      },
      {
        question: "Who is the current President of India?",
        options: ["Droupadi Murmu", "Ram Nath Kovind", "Pranab Mukherjee", "Pratibha Patil"],
        correctAnswer: "Droupadi Murmu",
      },
      {
        question: "Which digital payment system was launched by the Government of India?",
        options: ["UPI", "PayTM", "Google Pay", "PhonePe"],
        correctAnswer: "UPI",
      },
      {
        question: "Which mission aims to make India a $5 trillion economy?",
        options: ["Vision 2025", "Make in India", "Digital India", "Atmanirbhar Bharat"],
        correctAnswer: "Vision 2025",
      },
      {
        question: "Who is the current Finance Minister of India?",
        options: ["Nirmala Sitharaman", "Arun Jaitley", "P Chidambaram", "Amit Shah"],
        correctAnswer: "Nirmala Sitharaman",
      }
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
      {
        question: "Which protocol is used for secure web browsing?",
        options: ["HTTPS", "HTTP", "FTP", "SMTP"],
        correctAnswer: "HTTPS",
      },
      {
        question: "What is the primary function of RAM?",
        options: ["Temporary Storage", "Permanent Storage", "Processing", "Network Communication"],
        correctAnswer: "Temporary Storage",
      },
      {
        question: "Which database type uses tables and relations?",
        options: ["Relational", "NoSQL", "Graph", "Object-oriented"],
        correctAnswer: "Relational",
      },
      {
        question: "What is an API?",
        options: ["Application Programming Interface", "Advanced Program Integration", "Automated Program Installation", "Application Process Interface"],
        correctAnswer: "Application Programming Interface",
      },
      {
        question: "What is the purpose of DNS?",
        options: ["Domain Name Resolution", "Data Network Security", "Digital Network Service", "Dynamic Network System"],
        correctAnswer: "Domain Name Resolution",
      },
      {
        question: "Which programming paradigm does JavaScript primarily use?",
        options: ["Object-Oriented", "Functional", "Procedural", "Logic"],
        correctAnswer: "Object-Oriented",
      },
      {
        question: "What is the primary purpose of version control?",
        options: ["Track Code Changes", "Compile Code", "Debug Code", "Deploy Code"],
        correctAnswer: "Track Code Changes",
      },
      {
        question: "What is containerization in software development?",
        options: ["Application Packaging", "Data Storage", "Network Security", "User Interface"],
        correctAnswer: "Application Packaging",
      },
      {
        question: "Which cloud service provides computing resources?",
        options: ["IaaS", "PaaS", "SaaS", "FaaS"],
        correctAnswer: "IaaS",
      }
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
      {
        question: "Complete the series: 2, 6, 12, 20, ?",
        options: ["30", "28", "32", "26"],
        correctAnswer: "30",
      },
      {
        question: "If ROAD is coded as URDG, then SWAN is coded as?",
        options: ["VZDQ", "VZCQ", "VZCP", "VZAP"],
        correctAnswer: "VZDQ",
      },
      {
        question: "Find the odd one out: Cat, Dog, Snake, Elephant, Lion",
        options: ["Snake", "Cat", "Dog", "Lion"],
        correctAnswer: "Snake",
      },
      {
        question: "If 15% of x is 45, then x is?",
        options: ["300", "250", "350", "400"],
        correctAnswer: "300",
      },
      {
        question: "Complete the analogy: Book : Pages :: Tree : ?",
        options: ["Leaves", "Branches", "Roots", "Fruits"],
        correctAnswer: "Leaves",
      },
      {
        question: "If a clock shows 3:45, what is the angle between the hands?",
        options: ["157.5°", "160.5°", "162.5°", "165.5°"],
        correctAnswer: "157.5°",
      },
      {
        question: "What comes next in the pattern: 1, 4, 9, 16, 25, ?",
        options: ["36", "49", "64", "81"],
        correctAnswer: "36",
      },
      {
        question: "If LOG = 123, then BAG = ?",
        options: ["423", "432", "234", "324"],
        correctAnswer: "423",
      },
      {
        question: "Find the missing number: 7, 12, 19, 28, ?",
        options: ["39", "37", "41", "43"],
        correctAnswer: "39",
      }
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
      {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correctAnswer: "Au",
      },
      {
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
        correctAnswer: "Carbon Dioxide",
      },
      {
        question: "What is the largest organ in the human body?",
        options: ["Skin", "Liver", "Heart", "Brain"],
        correctAnswer: "Skin",
      },
      {
        question: "Which vitamin is produced when skin is exposed to sunlight?",
        options: ["Vitamin D", "Vitamin C", "Vitamin A", "Vitamin B"],
        correctAnswer: "Vitamin D",
      },
      {
        question: "What is the speed of light?",
        options: ["300,000 km/s", "200,000 km/s", "400,000 km/s", "500,000 km/s"],
        correctAnswer: "300,000 km/s",
      },
      {
        question: "Which blood type is known as the universal donor?",
        options: ["O-", "A+", "B+", "AB+"],
        correctAnswer: "O-",
      },
      {
        question: "What is the hardest natural substance on Earth?",
        options: ["Diamond", "Gold", "Iron", "Platinum"],
        correctAnswer: "Diamond",
      },
      {
        question: "Which element is most abundant in Earth's atmosphere?",
        options: ["Nitrogen", "Oxygen", "Carbon", "Hydrogen"],
        correctAnswer: "Nitrogen",
      },
      {
        question: "What is the process by which plants make their food?",
        options: ["Photosynthesis", "Respiration", "Digestion", "Absorption"],
        correctAnswer: "Photosynthesis",
      }
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
      {
        question: "What does HTML stand for?",
        options: ["HyperText Markup Language", "High Technical Modern Language", "HyperTransfer Mode Language", "High Text Markup Logic"],
        correctAnswer: "HyperText Markup Language",
      },
      {
        question: "Which programming language is known for Android development?",
        options: ["Kotlin", "Swift", "Python", "Ruby"],
        correctAnswer: "Kotlin",
      },
      {
        question: "What is the primary use of CSS?",
        options: ["Styling", "Programming", "Database", "Networking"],
        correctAnswer: "Styling",
      },
      {
        question: "Which symbol is used for single-line comments in JavaScript?",
        options: ["//", "/*", "#", "--"],
        correctAnswer: "//",
      },
      {
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Question Language", "System Query Logic", "Standard Quality Level"],
        correctAnswer: "Structured Query Language",
      },
      {
        question: "Which language is Python named after?",
        options: ["Monty Python", "Snake", "Computer Term", "Person"],
        correctAnswer: "Monty Python",
      },
      {
        question: "What is the file extension for Java source code?",
        options: [".java", ".js", ".py", ".cpp"],
        correctAnswer: ".java",
      },
      {
        question: "Which language is used for iOS development?",
        options: ["Swift", "Java", "Python", "C#"],
        correctAnswer: "Swift",
      },
      {
        question: "What does PHP stand for?",
        options: ["PHP: Hypertext Preprocessor", "Personal Home Page", "Programming High Protocol", "Public Host Program"],
        correctAnswer: "PHP: Hypertext Preprocessor",
      }
    ]
  }
};

export function QuizGame() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedSection) {
      const questions = [...quizSections[selectedSection].questions];
      // Fisher-Yates shuffle algorithm
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      setRandomizedQuestions(questions);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (transcript && isListening && selectedSection) {
      const answer = transcript.toLowerCase().trim();
      const correctAnswer = randomizedQuestions[currentQuestion].correctAnswer.toLowerCase();
      
      if (answer === correctAnswer) {
        stopListening();
        toast({
          title: "Correct!",
          description: "Well done! Moving to next question...",
        });
        setScore((prev) => prev + 1);
        setTimeout(() => {
          if (currentQuestion < randomizedQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
          } else {
            setGameOver(true);
          }
        }, 1500);
      } else if (randomizedQuestions[currentQuestion].options.map(opt => opt.toLowerCase()).includes(answer)) {
        stopListening();
        toast({
          title: "Incorrect",
          description: `The correct answer was ${randomizedQuestions[currentQuestion].correctAnswer}`,
          variant: "destructive",
        });
        setTimeout(() => {
          if (currentQuestion < randomizedQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
          } else {
            setGameOver(true);
          }
        }, 1500);
      }
    }
  }, [transcript, currentQuestion, isListening, stopListening, toast, selectedSection, randomizedQuestions]);

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameOver(false);
    setSelectedSection(null);
    setRandomizedQuestions([]);
  };

  const quitGame = () => {
    const confirmQuit = window.confirm("Are you sure you want to quit the quiz?");
    if (confirmQuit) {
      restartGame();
    }
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
          Your score: {score} out of {randomizedQuestions.length}
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

  return (
    <Card className="p-6 max-w-lg mx-auto mt-10">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm font-medium">
          Question {currentQuestion + 1}/{randomizedQuestions.length}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Score: {score}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={quitGame}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Quit
          </Button>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-4">
        {randomizedQuestions[currentQuestion]?.question}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {randomizedQuestions[currentQuestion]?.options.map((option, index) => (
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
