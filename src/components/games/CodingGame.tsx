
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

export function CodingGame() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing coding command:", command);
      
      // Handle variable creation
      if (command.includes("create") && command.includes("variable")) {
        const variableParts = command.match(/variable\s+(\w+)\s+equal\s+to\s+(\d+)/);
        if (variableParts) {
          const [_, varName, value] = variableParts;
          const newCode = `// Creating a variable named ${varName} with value ${value}
// Variables are containers for storing data values
let ${varName} = ${value};\n`;
          setCode(prev => prev + newCode);
          setOutput(`Variable ${varName} created with value ${value}`);
          stopListening();
          toast({
            title: "Code Created",
            description: `Created variable: ${varName}`,
          });
        }
      }
      // Handle function creation
      else if (command.includes("create") && command.includes("function")) {
        const funcParts = command.match(/function\s+(\w+)/);
        if (funcParts) {
          const [_, funcName] = funcParts;
          const newCode = `// Creating a function named ${funcName}
// Functions are reusable blocks of code that perform specific tasks
function ${funcName}() {
  // Function body - Add your code here
}\n`;
          setCode(prev => prev + newCode);
          setOutput(`Function ${funcName} created`);
          stopListening();
          toast({
            title: "Code Created",
            description: `Created function: ${funcName}`,
          });
        }
      }
      // Handle console.log
      else if (command.includes("print") || command.includes("log")) {
        const message = command.replace(/(print|log)/i, "").trim();
        const newCode = `// Adding a console.log statement to display: ${message}
// console.log is used to output content to the console
console.log("${message}");\n`;
        setCode(prev => prev + newCode);
        setOutput(`Added console.log statement`);
        stopListening();
        toast({
          title: "Code Created",
          description: "Added console.log statement",
        });
      }
    }
  }, [transcript, isListening, stopListening, toast]);

  const executeCode = () => {
    try {
      console.log("Executing code:");
      console.log(code);
      // Using Function constructor to safely evaluate code
      const result = new Function(code)();
      const consoleOutput = result !== undefined ? String(result) : "Code executed successfully";
      setOutput(consoleOutput);
      toast({
        title: "Code Executed",
        description: "Check the console for output",
      });
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      console.error("Code execution error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Voice Coding Game</h2>
        <Button
          variant="ghost"
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center space-x-2"
        >
          <Info className="w-4 h-4" />
          <span>How to Use</span>
        </Button>
      </div>

      {showExplanation && (
        <Card className="mb-6 p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Voice Command Examples</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Creating Variables:</h4>
              <p className="text-sm text-gray-600">Say: "Create variable count equal to 5"</p>
              <p className="text-sm text-gray-600">Output: let count = 5;</p>
            </div>
            <div>
              <h4 className="font-medium">Creating Functions:</h4>
              <p className="text-sm text-gray-600">Say: "Create function sayHello"</p>
              <p className="text-sm text-gray-600">Output: function sayHello() { }</p>
            </div>
            <div>
              <h4 className="font-medium">Printing to Console:</h4>
              <p className="text-sm text-gray-600">Say: "Print Hello World"</p>
              <p className="text-sm text-gray-600">Output: console.log("Hello World");</p>
            </div>
          </div>
        </Card>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• "Create variable [name] equal to [value]"</li>
          <li>• "Create function [name]"</li>
          <li>• "Print [message]" or "Log [message]"</li>
        </ul>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Code Editor</h3>
        <pre className="bg-gray-100 p-4 rounded-lg min-h-[200px] whitespace-pre-wrap font-mono text-sm">
          {code || "// Your code will appear here with explanations..."}
        </pre>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <pre className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
          {output || "// Output will appear here..."}
        </pre>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={isListening ? "bg-secondary" : "bg-primary"}
        >
          {isListening ? "Stop Listening" : "Start Speaking"}
        </Button>
        <Button onClick={executeCode} className="bg-accent">
          Run Code
        </Button>
        <Button 
          onClick={() => {
            setCode("");
            setOutput("");
          }} 
          variant="outline"
        >
          Clear Code
        </Button>
      </div>

      {isListening && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Listening... Say your command!
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
