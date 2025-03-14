
import React, { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function CodingGame() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();

      if (command.startsWith("create variable")) {
        const parts = command.split(" ");
        const name = parts[2];
        const value = parts.slice(4).join(" ");
        setCode((prevCode) => prevCode + `let ${name} = ${value};\n`);
        stopListening();
        toast({
          title: "Variable Created",
          description: `Created variable ${name} with value ${value}`,
        });
      } else if (command.startsWith("create function")) {
        const parts = command.split(" ");
        const name = parts[2];
        setCode((prevCode) => prevCode + `function ${name}() {\n  // Function body\n}\n`);
        stopListening();
        toast({
          title: "Function Created",
          description: `Created function ${name}`,
        });
      } else if (command.startsWith("print")) {
        const message = command.substring(6);
        setCode((prevCode) => prevCode + `console.log("${message}");\n`);
        stopListening();
        toast({
          title: "Console Log Added",
          description: `Added console.log statement for "${message}"`,
        });
      } else if (command.includes("run code")) {
        try {
          // eslint-disable-next-line no-new-func
          const fn = new Function(code);
          const result = fn();
          setOutput(String(result || "No output"));
          toast({
            title: "Code Executed",
            description: "Code executed successfully",
          });
        } catch (error: any) {
          setOutput(`Error: ${error.message}`);
          toast({
            title: "Code Error",
            description: error.message,
            variant: "destructive",
          });
        }
        stopListening();
      }
    }
  }, [transcript, isListening, stopListening, code, toast]);

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10 bg-gradient-to-br from-white to-blue-50 shadow-xl border-0">
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Voice Coding</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600 bg-white/60 p-3 rounded-lg">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Say "<span className="text-primary font-medium">create variable name equal to value</span>" to create a variable
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Say "<span className="text-primary font-medium">create function name</span>" to create a function
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Say "<span className="text-primary font-medium">print message</span>" to add a console.log statement
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Say "<span className="text-primary font-medium">run code</span>" to execute the code
          </li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Code Editor</h3>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here..."
          className="font-mono text-sm min-h-[200px] bg-white/80 border-blue-100 focus-visible:ring-blue-400"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <Card className="bg-gray-50 p-4 font-mono text-sm min-h-[80px] border-blue-100">
          {output || "Code output will appear here..."}
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={`${isListening ? "bg-secondary" : "bg-primary"} relative overflow-hidden group flex-1`}
        >
          <span className="relative z-10">
            {isListening ? "Stop Listening" : "Start Speaking"}
          </span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </Button>
        <Button 
          onClick={() => {
            try {
              // eslint-disable-next-line no-new-func
              const fn = new Function(code);
              const result = fn();
              setOutput(String(result || "No output"));
              toast({
                title: "Code Executed",
                description: "Code executed successfully",
              });
            } catch (error: any) {
              setOutput(`Error: ${error.message}`);
              toast({
                title: "Code Error",
                description: error.message,
                variant: "destructive",
              });
            }
          }} 
          variant="outline"
          className="flex-1 border-blue-200 hover:bg-blue-50"
        >
          Run Code
        </Button>
      </div>

      {isListening && (
        <div className="text-center mt-4 text-sm">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <p>Listening... Say a command!</p>
          </div>
        </div>
      )}
      {transcript && (
        <p className="text-center mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
          Heard: <span className="font-medium">{transcript}</span>
        </p>
      )}
    </Card>
  );
}
