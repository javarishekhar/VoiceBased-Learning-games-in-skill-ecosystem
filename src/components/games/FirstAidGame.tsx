
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Heart, Info } from "lucide-react";
import { motion } from "framer-motion";

interface Scenario {
  id: string;
  title: string;
  description: string;
  steps: string[];
  correctOrder: number[];
  videoUrl: string;
}

const scenarios: Scenario[] = [
  {
    id: "1",
    title: "CPR Procedure",
    description: "Learn the proper steps for performing CPR on an adult.",
    steps: [
      "Check the scene for safety",
      "Check for responsiveness",
      "Call 911 or ask someone to do it",
      "Check for breathing",
      "Begin chest compressions",
      "Give rescue breaths",
      "Continue CPR until help arrives"
    ],
    correctOrder: [0, 1, 2, 3, 4, 5, 6],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
  },
  {
    id: "2",
    title: "Treating a Burn",
    description: "Learn how to properly treat first, second, and third-degree burns.",
    steps: [
      "Ensure the scene is safe",
      "Cool the burn with cool running water",
      "Remove jewelry and tight items",
      "Cover with a sterile, non-stick bandage",
      "Take pain medication if needed",
      "Watch for signs of infection",
      "Seek medical attention if severe"
    ],
    correctOrder: [0, 1, 2, 3, 4, 5, 6],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
  }
];

const FirstAidGame = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(scenarios[0]);
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [remainingSteps, setRemainingSteps] = useState<number[]>([...Array(scenarios[0].steps.length).keys()]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const handleStepClick = (index: number) => {
    if (remainingSteps.includes(index)) {
      setSelectedSteps([...selectedSteps, index]);
      setRemainingSteps(remainingSteps.filter(i => i !== index));
    }
  };

  const handleSelectedStepClick = (index: number, position: number) => {
    const updatedSelected = [...selectedSteps];
    updatedSelected.splice(position, 1);
    setSelectedSteps(updatedSelected);
    setRemainingSteps([...remainingSteps, index].sort((a, b) => a - b));
  };

  const checkOrder = () => {
    const isOrderCorrect = selectedSteps.every((step, i) => step === currentScenario.correctOrder[i]);
    setIsCorrect(isOrderCorrect);
    if (isOrderCorrect) {
      setTimeout(() => {
        setShowVideo(true);
      }, 1500);
    }
  };

  const resetScenario = () => {
    setSelectedSteps([]);
    setRemainingSteps([...Array(currentScenario.steps.length).keys()]);
    setIsCorrect(null);
    setShowVideo(false);
  };

  const changeScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setCurrentScenario(scenario);
      setSelectedSteps([]);
      setRemainingSteps([...Array(scenario.steps.length).keys()]);
      setIsCorrect(null);
      setShowVideo(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
        <Heart className="mr-2 text-red-500" /> First Aid Training
      </h1>
      
      <p className="text-gray-600 mb-6">
        Learn first aid procedures through interactive scenarios. Arrange the steps in the correct order.
      </p>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        {scenarios.map((scenario) => (
          <Button
            key={scenario.id}
            variant={currentScenario.id === scenario.id ? "default" : "outline"}
            onClick={() => changeScenario(scenario.id)}
            className="flex gap-2 items-center"
          >
            {scenario.title}
          </Button>
        ))}
      </div>
      
      {isCorrect === true && (
        <Alert variant="default" className="bg-green-100 border-green-300 mb-6">
          <Info className="h-4 w-4 text-green-800" />
          <AlertTitle className="text-green-800">Correct sequence!</AlertTitle>
          <AlertDescription className="text-green-700">
            Great job! You've mastered the correct sequence for this first aid procedure.
          </AlertDescription>
        </Alert>
      )}
      
      {isCorrect === false && (
        <Alert variant="destructive" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Incorrect sequence</AlertTitle>
          <AlertDescription>
            The order is not correct. Please try again.
          </AlertDescription>
        </Alert>
      )}
      
      {!showVideo ? (
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{currentScenario.title}</h2>
            <p className="text-gray-600 mb-6">{currentScenario.description}</p>
            
            <h3 className="text-md font-medium mb-3">Your Sequence:</h3>
            <div className="border rounded-md p-4 min-h-40 mb-4 bg-gray-50">
              {selectedSteps.length === 0 ? (
                <p className="text-gray-400 italic">Drag steps here in the correct order</p>
              ) : (
                <ol className="space-y-2">
                  {selectedSteps.map((stepIndex, position) => (
                    <motion.li 
                      key={`selected-${stepIndex}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleSelectedStepClick(stepIndex, position)}
                      className="p-2 border rounded bg-primary/10 cursor-pointer flex items-center"
                    >
                      <Badge className="mr-2">{position + 1}</Badge>
                      {currentScenario.steps[stepIndex]}
                    </motion.li>
                  ))}
                </ol>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={resetScenario}>Reset</Button>
              <Button 
                onClick={checkOrder} 
                disabled={selectedSteps.length !== currentScenario.steps.length}
              >
                Check Order
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-md font-medium mb-3">Available Steps:</h3>
            <div className="border rounded-md p-4 min-h-40 bg-gray-50">
              {remainingSteps.length === 0 ? (
                <p className="text-gray-400 italic">All steps have been used</p>
              ) : (
                <ul className="space-y-2">
                  {remainingSteps.map((stepIndex) => (
                    <motion.li 
                      key={`remaining-${stepIndex}`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleStepClick(stepIndex)}
                      className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                    >
                      {currentScenario.steps[stepIndex]}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Progress:</h3>
              <Progress value={(selectedSteps.length / currentScenario.steps.length) * 100} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                {selectedSteps.length} of {currentScenario.steps.length} steps arranged
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Demonstration Video</h2>
            <Button variant="outline" size="sm" onClick={() => setShowVideo(false)}>
              Back to Exercise
            </Button>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe 
              width="100%" 
              height="100%" 
              src={currentScenario.videoUrl} 
              title="First Aid Demonstration" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default FirstAidGame;
