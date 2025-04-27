
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface CommandHandlerProps {
  code: string;
  setCode: (code: string) => void;
  setOutput: (output: string) => void;
  language: string;
}

export const useCommandHandlers = ({ code, setCode, setOutput, language }: CommandHandlerProps) => {
  const { toast } = useToast();

  const executeCode = () => {
    try {
      const result = new Function(code)();
      setOutput(String(result));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleVariableUpdate = (
    lines: string[],
    varPattern: RegExp,
    value: string,
    description: string
  ) => {
    let updatedCode = '';
    let updated = false;
    
    for (const line of lines) {
      if (line.match(varPattern)) {
        updatedCode += line.replace(/=\s*([^;]+);/, `= ${value};`) + '\n';
        updated = true;
      } else {
        updatedCode += line + '\n';
      }
    }

    if (updated) {
      setCode(updatedCode);
      toast({
        title: "Variable Updated",
        description,
      });
    } else {
      toast({
        title: "Variable Not Found",
        description: `Couldn't find variable to update`,
        variant: "destructive",
      });
    }

    return updated;
  };

  return {
    executeCode,
    handleVariableUpdate,
  };
};

