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
          setOutput(String(result) || "No output");
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
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Voice Coding</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Say "<span className="text-primary">create variable name equal to value</span>" to create a variable</li>
          <li>• Say "<span className="text-primary">create function name</span>" to create a function</li>
          <li>• Say "<span className="text-primary">print message</span>" to add a console.log statement</li>
          <li>• Say "<span className="text-primary">run code</span>" to execute the code</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Code Editor</h3>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here..."
          className="font-mono text-sm"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <Card className="bg-gray-50 p-4 font-mono text-sm">
          {output}
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={isListening ? "bg-secondary" : "bg-primary"}
        >
          {isListening ? "Stop Listening" : "Start Speaking"}
        </Button>
        <Button onClick={() => {
          try {
            // eslint-disable-next-line no-new-func
            const fn = new Function(code);
            const result = fn();
            setOutput(String(result) || "No output");
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
        }} variant="outline">Run Code</Button>
      </div>

      {isListening && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Listening... Say a command!
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
