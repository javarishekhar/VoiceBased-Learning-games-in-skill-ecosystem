import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CodingGame = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isVoiceActive) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }

    return () => {
      stopVoiceRecognition();
    };
  }, [isVoiceActive]);

  const startVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("Voice recognition started");
      };

      recognition.onresult = (event) => {
        let interimCode = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setCode((prevCode) => prevCode + event.results[i][0].transcript);
          } else {
            interimCode += event.results[i][0].transcript;
          }
        }
        console.log("Interim Code:", interimCode);
      };

      recognition.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
      };

      recognition.onend = () => {
        console.log("Voice recognition ended");
        if (isVoiceActive) {
          // Restart recognition if it ended unexpectedly
          startVoiceRecognition();
        }
      };

      recognition.start();
    } else {
      console.log("Web Speech API is not supported in this browser.");
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log("Voice recognition stopped");
    }
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const runCode = () => {
    setIsProcessing(true);
    setOutput("Running...");

    // Simulate running the code with a delay
    setTimeout(() => {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(code);
        const result = fn();
        setOutput(String(result) || "No output");
      } catch (e) {
        setOutput("Error: " + e.message);
      } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="code">Enter Code:</Label>
          <Button
            variant="outline"
            onClick={() => setIsVoiceActive(!isVoiceActive)}
          >
            {isVoiceActive ? "Stop Voice" : "Start Voice"}
          </Button>
        </div>
        <Textarea
          id="code"
          value={code}
          onChange={handleCodeChange}
          placeholder="Type or speak your code here..."
          className="h-48 resize-none"
        />
        <Button onClick={runCode} disabled={isProcessing}>
          {isProcessing ? "Running..." : "Run Code"}
        </Button>
        <div>
          <Label htmlFor="output">Output:</Label>
          <Textarea
            id="output"
            value={output}
            readOnly
            className="h-24 resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { CodingGame };
