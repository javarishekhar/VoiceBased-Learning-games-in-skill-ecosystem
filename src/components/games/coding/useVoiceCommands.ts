import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { useToast } from "@/hooks/use-toast";
import { commands } from "./commands";
import { programTemplates } from "./programTemplates";

export const useVoiceCommands = (code: string, setCode: (code: string) => void, setOutput: (output: string) => void) => {
  const { transcript, isListening, startListening: toggleListening, clearTranscript: resetTranscript } = useVoice();
  const { toast } = useToast();

  const executeCode = () => {
    try {
      // Create a new Function from the code and execute it
      const result = new Function(code)();
      setOutput(String(result));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

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
      toast({
        title: "Code Cleared",
        description: "Cleared all code",
      });
      commandProcessed = true;
    }

    // First number command
    const firstNumMatch = transcript.match(commands.firstNumber);
    if (firstNumMatch && !commandProcessed) {
      const [_, value] = firstNumMatch;
      
      try {
        const lines = code.split('\n');
        let updatedCode = '';
        let updated = false;
        
        for (const line of lines) {
          // Match num1 declarations in different languages
          const jsMatch = line.match(/\b(let|var|const)\s+num1\s*=\s*([^;]+);/);
          const pyMatch = line.match(/\bnum1\s*=\s*(.+)/);
          const cMatch = line.match(/\b(int|float|double)\s+num1\s*=\s*([^;]+);/);
          
          if (jsMatch || pyMatch || cMatch) {
            // For JavaScript
            if (jsMatch) {
              updatedCode += line.replace(/=\s*([^;]+);/, `= ${value};`) + '\n';
            } 
            // For Python
            else if (pyMatch) {
              updatedCode += line.replace(/=\s*(.+)$/, `= ${value}`) + '\n';
            } 
            // For C/Java
            else if (cMatch) {
              updatedCode += line.replace(/=\s*([^;]+);/, `= ${value};`) + '\n';
            }
            updated = true;
          } else {
            updatedCode += line + '\n';
          }
        }
        
        if (updated) {
          setCode(updatedCode);
          toast({
            title: "First Number Updated",
            description: `Set first number to ${value}`,
          });
        } else {
          toast({
            title: "Variable Not Found",
            description: `Couldn't find first number variable to update`,
            variant: "destructive",
          });
        }
        
      } catch (error) {
        console.error("Error updating first number:", error);
        toast({
          title: "Error",
          description: `Failed to update first number: ${error.message}`,
          variant: "destructive",
        });
      }
      
      commandProcessed = true;
    }

    // Second number command
    const secondNumMatch = transcript.match(commands.secondNumber);
    if (secondNumMatch && !commandProcessed) {
      const [_, value] = secondNumMatch;
      
      try {
        const lines = code.split('\n');
        let updatedCode = '';
        let updated = false;
        
        for (const line of lines) {
          // Match num2 declarations in different languages
          const jsMatch = line.match(/\b(let|var|const)\s+num2\s*=\s*([^;]+);/);
          const pyMatch = line.match(/\bnum2\s*=\s*(.+)/);
          const cMatch = line.match(/\b(int|float|double)\s+num2\s*=\s*([^;]+);/);
          
          if (jsMatch || pyMatch || cMatch) {
            // For JavaScript
            if (jsMatch) {
              updatedCode += line.replace(/=\s*([^;]+);/, `= ${value};`) + '\n';
            } 
            // For Python
            else if (pyMatch) {
              updatedCode += line.replace(/=\s*(.+)$/, `= ${value}`) + '\n';
            } 
            // For C/Java
            else if (cMatch) {
              updatedCode += line.replace(/=\s*([^;]+);/, `= ${value};`) + '\n';
            }
            updated = true;
          } else {
            updatedCode += line + '\n';
          }
        }
        
        if (updated) {
          setCode(updatedCode);
          toast({
            title: "Second Number Updated",
            description: `Set second number to ${value}`,
          });
        } else {
          toast({
            title: "Variable Not Found",
            description: `Couldn't find second number variable to update`,
            variant: "destructive",
          });
        }
        
      } catch (error) {
        console.error("Error updating second number:", error);
        toast({
          title: "Error",
          description: `Failed to update second number: ${error.message}`,
          variant: "destructive",
        });
      }
      
      commandProcessed = true;
    }

    // Set input command (for updating variables in the program)
    const inputMatch = transcript.match(commands.setInput);
    if (inputMatch && !commandProcessed) {
      const [_, varName, varValue] = inputMatch;
      
      // Attempt to update the variable in the code
      try {
        const lines = code.split('\n');
        let updatedCode = '';
        let updated = false;
        
        for (const line of lines) {
          // Match variable declarations in different languages
          const jsMatch = line.match(new RegExp(`\\b(let|var|const)\\s+${varName}\\s*=\\s*([^;]+);`));
          const pyMatch = line.match(new RegExp(`\\b${varName}\\s*=\\s*(.+)`));
          const cMatch = line.match(new RegExp(`\\b(int|float|double)\\s+${varName}\\s*=\\s*([^;]+);`));
          
          if (jsMatch || pyMatch || cMatch) {
            // For JavaScript
            if (jsMatch) {
              updatedCode += line.replace(/=\s*([^;]+);/, `= ${varValue};`) + '\n';
            } 
            // For Python
            else if (pyMatch) {
              updatedCode += line.replace(/=\s*(.+)$/, `= ${varValue}`) + '\n';
            } 
            // For C/Java
            else if (cMatch) {
              updatedCode += line.replace(/=\s*([^;]+);/, `= ${varValue};`) + '\n';
            }
            updated = true;
          } else {
            updatedCode += line + '\n';
          }
        }
        
        if (updated) {
          setCode(updatedCode);
          toast({
            title: "Input Updated",
            description: `Set ${varName} to ${varValue}`,
          });
        } else {
          toast({
            title: "Variable Not Found",
            description: `Couldn't find variable ${varName} to update`,
            variant: "destructive",
          });
        }
        
      } catch (error) {
        console.error("Error updating variable:", error);
        toast({
          title: "Error",
          description: `Failed to update variable: ${error.message}`,
          variant: "destructive",
        });
      }
      
      commandProcessed = true;
    }

    // Set number command
    const setNumMatch = transcript.match(commands.setNumber);
    if (setNumMatch && !commandProcessed) {
      const [_, value] = setNumMatch;
      
      try {
        const lines = code.split('\n');
        let updatedCode = '';
        let updated = false;
        
        for (const line of lines) {
          // Match number/year declarations in different languages
          const jsMatch = line.match(/\b(let|var|const)\s+(number|num|year)\s*=\s*([^;]+);/);
          const pyMatch = line.match(/\b(number|num|year)\s*=\s*(.+)/);
          const cMatch = line.match(/\b(int|float|double)\s+(number|num|year)\s*=\s*([^;]+);/);
          
          if (jsMatch || pyMatch || cMatch) {
            // For JavaScript
            if (jsMatch) {
              updatedCode += line.replace(/=\s*([^;]+);/, `= ${value};`) + '\n';
            } 
            // For Python
            else if (pyMatch) {
              updatedCode += line.replace(/=\s*(.+)$/, `= ${value}`) + '\n';
            } 
            // For C/Java
            else if (cMatch) {
              updatedCode += line.replace(/=\s*([^;]+);/, `= ${value};`) + '\n';
            }
            updated = true;
          } else {
            updatedCode += line + '\n';
          }
        }
        
        if (updated) {
          setCode(updatedCode);
          toast({
            title: "Number Updated",
            description: `Set number to ${value}`,
          });
        } else {
          toast({
            title: "Variable Not Found",
            description: `Couldn't find number variable to update`,
            variant: "destructive",
          });
        }
        
      } catch (error) {
        console.error("Error updating number:", error);
        toast({
          title: "Error",
          description: `Failed to update number: ${error.message}`,
          variant: "destructive",
        });
      }
      
      commandProcessed = true;
    }

    // Multiplication program command
    if (transcript.match(commands.multiplicationProgram) && !commandProcessed) {
      setCode(programTemplates[language].multiplication);
      toast({
        title: "Program Created",
        description: "Created multiplication program",
      });
      commandProcessed = true;
    }

    // Division program command
    if (transcript.match(commands.divisionProgram) && !commandProcessed) {
      setCode(programTemplates[language].division);
      toast({
        title: "Program Created",
        description: "Created division program",
      });
      commandProcessed = true;
    }

    // Leap year program command
    if (transcript.match(commands.leapYearProgram) && !commandProcessed) {
      setCode(programTemplates[language].leapYear);
      toast({
        title: "Program Created",
        description: "Created leap year program",
      });
      commandProcessed = true;
    }

    // Even odd program command
    if (transcript.match(commands.evenOddProgram) && !commandProcessed) {
      setCode(programTemplates[language].evenOdd);
      toast({
        title: "Program Created",
        description: "Created even odd program",
      });
      commandProcessed = true;
    }

    // Prime number program command
    if (transcript.match(commands.primeNumberProgram) && !commandProcessed) {
      setCode(programTemplates[language].primeNumber);
      toast({
        title: "Program Created",
        description: "Created prime number program",
      });
      commandProcessed = true;
    }
    
    // Addition program command
    if (transcript.match(commands.additionProgram) && !commandProcessed) {
      setCode(programTemplates[language].addition);
      toast({
        title: "Program Created",
        description: "Created addition program",
      });
      commandProcessed = true;
    }

    // LCM program command
    if (transcript.match(commands.lcmProgram) && !commandProcessed) {
      setCode(programTemplates[language].lcm);
      toast({
        title: "Program Created",
        description: "Created LCM program",
      });
      commandProcessed = true;
    }

    // Help command
    if (transcript.match(commands.help) && !commandProcessed) {
      toast({
        title: "Available Commands",
        description: `
          - Create variable: create a variable <name> equal to <value>
          - Create function: create a function <name>
          - Print: print <value>
          - Run code: run the code
          - Clear code: clear the code
          - Set input: set <variable> to <value>
          - First number is: first number is <value>
          - Second number is: second number is <value>
          - Set number: set number to <value>
          - Multiplication program: write a program on multiplication of two numbers
          - Division program: write a program on division of two numbers
          - Leap year program: write a program on leap year
          - Even odd program: write a program on even or odd
          - Prime number program: write a program on prime number
          - Addition program: write a program on addition of two numbers
          - LCM program: write a program on lcm of two numbers
        `,
        duration: 10000,
      });
      commandProcessed = true;
    }

    if (commandProcessed) {
      resetTranscript();
    }
  }, [transcript, code, setCode, toast, language, resetTranscript, executeCode, setOutput]);

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
