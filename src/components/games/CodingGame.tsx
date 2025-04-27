import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeEditor } from "./coding/CodeEditor";
import { OutputWindow } from "./coding/OutputWindow";
import { useVoiceCommands } from "./coding/useVoiceCommands";
import { programTemplates } from "./coding/programTemplates";

export const CodingGame = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [language, setLanguage] = useState("javascript");
  const [currentProgram, setCurrentProgram] = useState("");

  const { isListening, startListening, clearTranscript } = useVoiceCommands(
    code, 
    setCode, 
    setOutput,
    language
  );

  // Effect to update code when language changes
  useEffect(() => {
    if (currentProgram && language) {
      setCode(programTemplates[language][currentProgram]);
    }
  }, [language, currentProgram]);

  const executeCode = () => {
    try {
      const result = new Function(code)();
      setOutput(String(result));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => startListening()}
            variant={isListening ? "destructive" : "default"}
          >
            {isListening ? "Stop Listening" : "Start Listening"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            <CodeEditor code={code} onChange={setCode} />
          </TabsContent>
          <TabsContent value="output">
            <OutputWindow output={output} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setCode("")}>
            Clear
          </Button>
          <Button onClick={executeCode}>Run Code</Button>
        </div>
      </div>
    </Card>
  );
};
