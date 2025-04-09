import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

// Define voice commands for the coding game
const commands = {
  createVariable: /create\s+(?:a\s+)?variable\s+(\w+)\s+(?:equal\s+to|equals|=)\s+(.+)/i,
  createFunction: /create\s+(?:a\s+)?function\s+(\w+)/i,
  print: /print\s+(.+)/i,
  runCode: /run\s+(?:the\s+)?code/i,
  clearCode: /clear\s+(?:the\s+)?code/i,
  help: /(?:show|tell\s+me)\s+(?:the\s+)?commands/i,
};

// Editor styles
const editorStyles = {
  fontFamily: "monospace",
  fontSize: "14px",
  lineHeight: "1.5",
  padding: "1rem",
  border: "1px solid #e2e8f0",
  borderRadius: "0.375rem",
  backgroundColor: "#f8fafc",
  color: "#334155",
  height: "300px",
  width: "100%",
  resize: "none",
  outline: "none",
};

// Output styles
const outputStyles = {
  fontFamily: "monospace",
  fontSize: "14px",
  lineHeight: "1.5",
  padding: "1rem",
  border: "1px solid #e2e8f0",
  borderRadius: "0.375rem",
  backgroundColor: "#1e293b",
  color: "#e2e8f0",
  height: "150px",
  width: "100%",
  overflow: "auto",
};

export const CodingGame = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const { transcript, listening, toggleListening, resetTranscript } = useVoice();
  const { toast } = useToast();

  // Handle voice commands
  useEffect(() => {
    if (!transcript) return;

    let commandProcessed = false;

    // Create variable command
    const variableMatch = transcript.match(commands.createVariable);
    if (variableMatch) {
      const [_, varName, varValue] = variableMatch;
      const newCode = `${code}const ${varName} = ${varValue};\n`;
      setCode(newCode);
      toast({
        title: "Variable Created",
        description: `Created variable "${varName}" with value "${varValue}"`,
      });
      commandProcessed = true;
    }

    // Create function command
    const functionMatch = transcript.match(commands.createFunction);
    if (functionMatch && !commandProcessed) {
      const [_, funcName] = functionMatch;
      const newCode = `${code}function ${funcName}() {\n  // Function body\n}\n`;
      setCode(newCode);
      toast({
        title: "Function Created",
        description: `Created function "${funcName}"`,
      });
      commandProcessed = true;
    }

    // Print command
    const printMatch = transcript.match(commands.print);
    if (printMatch && !commandProcessed) {
      const [_, printValue] = printMatch;
      const newCode = `${code}console.log(${printValue});\n`;
      setCode(newCode);
      toast({
        title: "Print Statement Added",
        description: `Added console.log for "${printValue}"`,
      });
      commandProcessed = true;
    }

    // Run code command
    if (transcript.match(commands.runCode) && !commandProcessed) {
      executeCode();
      commandProcessed = true;
    }

    // Clear code command
    if (transcript.match(commands.clearCode) && !commandProcessed) {
      setCode("");
      setOutput("");
      toast({
        title: "Code Cleared",
        description: "Cleared all code and output",
      });
      commandProcessed = true;
    }

    // Help command
    if (transcript.match(commands.help) && !commandProcessed) {
      toast({
        title: "Available Commands",
        description: `
          - "Create variable [name] equal to [value]"
          - "Create function [name]"
          - "Print [value]"
          - "Run code"
          - "Clear code"
        `,
        duration: 5000,
      });
      commandProcessed = true;
    }

    if (commandProcessed) {
      resetTranscript();
    }
  }, [transcript, code, toast, resetTranscript]);

  const executeCode = () => {
    try {
      // For sum program
      const originalConsoleLog = console.log;
      let outputText = "";
      
      // Override console.log to capture output
      console.log = (...args) => {
        const output = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : arg
        ).join(' ');
        outputText += output + '\n';
        originalConsoleLog(...args);
      };
      
      // Fix type error by ensuring parameters are numbers
      const calculateAverage = (numbers) => {
        if (!numbers || !numbers.length) return 0;
        const sum = numbers.reduce((acc, num) => acc + Number(num), 0);
        return sum / numbers.length;
      };
      
      // Execute the code
      // eslint-disable-next-line no-new-func
      new Function(code)();
      
      // Restore console.log
      console.log = originalConsoleLog;
      
      setOutput(outputText || "Code executed successfully with no output.");
      setActiveTab("output");
      
      // Show confetti for successful execution
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Code Executed",
        description: "Your code ran successfully!",
      });
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setActiveTab("output");
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Voice Coding Studio</h2>
        <Button
          onClick={toggleListening}
          variant={listening ? "destructive" : "default"}
        >
          {listening ? "Stop Listening" : "Start Voice Commands"}
        </Button>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Use voice commands to write code. Try saying:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li>"Create variable count equal to 10"</li>
          <li>"Create function calculateSum"</li>
          <li>"Print Hello world"</li>
          <li>"Run code"</li>
        </ul>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="editor">Code Editor</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <textarea
            value={code}
            onChange={handleCodeChange}
            style={editorStyles}
            placeholder="// Your code will appear here as you speak commands"
          />
        </TabsContent>
        <TabsContent value="output">
          <div style={outputStyles}>
            <pre>{output}</pre>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" onClick={() => {
          setCode("");
          setOutput("");
        }}>
          Clear Code
        </Button>
        <Button onClick={executeCode}>Run Code</Button>
      </div>

      {listening && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Listening:</strong> {transcript}
          </p>
        </div>
      )}
    </Card>
  );
};
