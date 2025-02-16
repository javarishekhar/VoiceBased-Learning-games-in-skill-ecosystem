
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Info, PlayCircle, Code as CodeIcon } from "lucide-react";

export function CodingGame() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCodeDetails, setShowCodeDetails] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
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
          const newCode = `/* Variable Creation Explanation:
   - Creating a variable named '${varName}'
   - Initial value: ${value}
   - Variables are containers for storing data that can be modified later
   - Example usage: ${varName} can be used in calculations or displayed
*/
let ${varName} = ${value}; // Initializing ${varName} with value ${value}\n`;
          setCode(prev => prev + newCode);
          console.log(`Created variable ${varName} with value ${value}`);
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
          const newCode = `/* Function Creation Explanation:
   - Creating a function named '${funcName}'
   - Functions are reusable blocks of code
   - They can accept parameters and return values
   - Example usage: ${funcName}() to execute the function
*/
function ${funcName}() {
  // Function body - Add your code here
  console.log("${funcName} function executed");
}\n`;
          setCode(prev => prev + newCode);
          console.log(`Created function ${funcName}`);
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
        const newCode = `/* Console Output Explanation:
   - Using console.log to display: "${message}"
   - This will output the message to the browser's console
   - Useful for debugging and displaying information
*/
console.log("${message}"); // Outputs: ${message}\n`;
        setCode(prev => prev + newCode);
        console.log(`Added console.log for message: ${message}`);
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
      console.group("Code Execution Results");
      console.log("Executing code:\n", code);
      
      // Create a safe environment for code execution
      const previewWindow = window.open("", "Preview", "width=600,height=400");
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Code Preview</title>
            </head>
            <body>
              <div id="output"></div>
              <script>
                // Redirect console.log to both preview and main window
                const originalLog = console.log;
                console.log = (...args) => {
                  originalLog.apply(console, args);
                  const output = document.getElementById('output');
                  output.innerHTML += args.join(' ') + '<br>';
                };
                try {
                  ${code}
                } catch (error) {
                  console.error('Error:', error);
                }
              </script>
            </body>
          </html>
        `);
        previewWindow.document.close();
      } else {
        toast({
          title: "Warning",
          description: "Please allow pop-ups to see the preview window",
          variant: "destructive",
        });
      }
      
      // Execute in main window as well
      const result = new Function(code)();
      const consoleOutput = result !== undefined ? String(result) : "Code executed successfully";
      console.log("Execution output:", consoleOutput);
      console.groupEnd();
      setOutput(consoleOutput);
      
      toast({
        title: "Code Executed",
        description: "Check the preview window and browser console (F12) for output",
      });
    } catch (error) {
      console.error("Code execution error:", error);
      setOutput(`Error: ${error.message}`);
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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setShowCodeDetails(!showCodeDetails);
              setShowExplanation(false);
            }}
            className="flex items-center space-x-2"
          >
            <CodeIcon className="w-4 h-4" />
            <span>Code Details</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setShowExplanation(!showExplanation);
              setShowCodeDetails(false);
            }}
            className="flex items-center space-x-2"
          >
            <Info className="w-4 h-4" />
            <span>How to Use</span>
          </Button>
        </div>
      </div>

      {showCodeDetails && (
        <Card className="mb-6 p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Code Explanation</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Variables:</h4>
              <p className="text-sm text-gray-600">Variables store data that can be used throughout your code.</p>
              <p className="text-sm text-gray-600">Example: let count = 5;</p>
              <p className="text-sm text-gray-600">Usage: count + 1 = 6</p>
            </div>
            <div>
              <h4 className="font-medium">Functions:</h4>
              <p className="text-sm text-gray-600">Functions are reusable blocks of code that perform specific tasks.</p>
              <p className="text-sm text-gray-600">Example: function greet(name) { return "Hello " + name; }</p>
              <p className="text-sm text-gray-600">Usage: greet("John") outputs "Hello John"</p>
            </div>
            <div>
              <h4 className="font-medium">Console Output:</h4>
              <p className="text-sm text-gray-600">console.log displays messages in the browser's console (F12).</p>
              <p className="text-sm text-gray-600">Example: console.log("Hello!");</p>
              <p className="text-sm text-gray-600">Output in console: Hello!</p>
            </div>
          </div>
        </Card>
      )}

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
          {code || "// Your code will appear here with explanations...\n// Use voice commands to start coding!"}
        </pre>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <pre className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
          {output || "// Output will appear here...\n// Press 'Run Code' to see results in console (F12) and preview window"}
        </pre>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={isListening ? "bg-secondary" : "bg-primary"}
        >
          {isListening ? "Stop Listening" : "Start Speaking"}
        </Button>
        <Button 
          onClick={executeCode} 
          className="bg-accent flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" />
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
