
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { commands } from "./commands";
import { useCommandHandlers } from "./handlers/useCommandHandlers";
import { useProgramHandlers } from "./handlers/useProgramHandlers";
import { useVariableHandlers } from "./handlers/useVariableHandlers";

export const useVoiceCommands = (
  code: string,
  setCode: (code: string) => void,
  setOutput: (output: string) => void,
  language: string
) => {
  const {
    transcript,
    isListening,
    startListening: toggleListening,
    clearTranscript: resetTranscript,
  } = useVoice();
  
  const { executeCode, handleVariableUpdate } = useCommandHandlers({
    code,
    setCode,
    setOutput,
    language,
  });
  
  const { handleProgramCommand } = useProgramHandlers(language, setCode);
  const { createVariable, createFunction, addPrint } = useVariableHandlers(code, setCode);

  useEffect(() => {
    if (!transcript) return;

    let commandProcessed = false;

    // Create variable command
    const variableMatch = transcript.match(commands.createVariable);
    if (variableMatch) {
      const [_, varName, varValue] = variableMatch;
      createVariable(varName, varValue);
      commandProcessed = true;
    }

    // Create function command
    const functionMatch = transcript.match(commands.createFunction);
    if (functionMatch && !commandProcessed) {
      const [_, funcName] = functionMatch;
      createFunction(funcName);
      commandProcessed = true;
    }

    // Print command
    const printMatch = transcript.match(commands.print);
    if (printMatch && !commandProcessed) {
      const [_, printValue] = printMatch;
      addPrint(printValue);
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
      commandProcessed = true;
    }

    // Handle program templates
    Object.entries(commands).forEach(([key, regex]) => {
      if (key.endsWith('Program')) {
        const match = transcript.match(regex);
        if (match && !commandProcessed) {
          const programKey = key.replace('Program', '');
          if (handleProgramCommand(programKey)) {
            commandProcessed = true;
          }
        }
      }
    });

    // First number command
    const firstNumMatch = transcript.match(commands.firstNumber);
    if (firstNumMatch && !commandProcessed) {
      const [_, value] = firstNumMatch;
      handleVariableUpdate(
        code.split('\n'),
        /\b(let|var|const)\s+num1\s*=\s*([^;]+);/,
        value,
        `Set first number to ${value}`
      );
      commandProcessed = true;
    }

    // Second number command
    const secondNumMatch = transcript.match(commands.secondNumber);
    if (secondNumMatch && !commandProcessed) {
      const [_, value] = secondNumMatch;
      handleVariableUpdate(
        code.split('\n'),
        /\b(let|var|const)\s+num2\s*=\s*([^;]+);/,
        value,
        `Set second number to ${value}`
      );
      commandProcessed = true;
    }

    // Number/year command
    const setNumMatch = transcript.match(commands.setNumber);
    if (setNumMatch && !commandProcessed) {
      const [_, value] = setNumMatch;
      handleVariableUpdate(
        code.split('\n'),
        /\b(let|var|const)\s+(number|num|year)\s*=\s*([^;]+);/,
        value,
        `Set number to ${value}`
      );
      commandProcessed = true;
    }

    if (commandProcessed) {
      resetTranscript();
    }
  }, [transcript, code, setCode, language, resetTranscript, setOutput]);

  const startListening = () => {
    resetTranscript();
    toggleListening();
  };

  return {
    isListening,
    startListening,
    clearTranscript: resetTranscript,
  };
};

