
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Info, PlayCircle, Code as CodeIcon, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CodingGame() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCodeDetails, setShowCodeDetails] = useState(false);
  const [num1, setNum1] = useState<number | null>(null);
  const [num2, setNum2] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [codeType, setCodeType] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const { transcript, isListening, startListening, stopListening } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing coding command:", command);
      
      // Handle program generation for sum of two numbers
      if (command.includes("write") && command.includes("program") && command.includes("sum")) {
        const sumProgram = getCodeTemplate("sum", language);
        setCode(sumProgram);
        setCodeType("sum");
        setOutput("Please provide two numbers using voice commands: 'first number is X' and 'second number is Y'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the numbers using voice commands",
        });
      }
      
      // Handle program generation for multiplication of two numbers
      else if (command.includes("write") && command.includes("program") && command.includes("multiplication")) {
        const multiplicationProgram = getCodeTemplate("multiplication", language);
        setCode(multiplicationProgram);
        setCodeType("multiplication");
        setOutput("Please provide two numbers using voice commands: 'first number is X' and 'second number is Y'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the numbers using voice commands",
        });
      }
      
      // Handle program generation for division of two numbers
      else if (command.includes("write") && command.includes("program") && command.includes("division")) {
        const divisionProgram = getCodeTemplate("division", language);
        setCode(divisionProgram);
        setCodeType("division");
        setOutput("Please provide two numbers using voice commands: 'first number is X' and 'second number is Y'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the numbers using voice commands",
        });
      }
      
      // Handle program generation for leap year
      else if (command.includes("write") && command.includes("program") && command.includes("leap year")) {
        const leapYearProgram = getCodeTemplate("leapyear", language);
        setCode(leapYearProgram);
        setCodeType("leapyear");
        setOutput("Please provide a year using voice command: 'year is X'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the year using voice command",
        });
      }
      
      // Handle first number input
      else if (command.includes("first number is")) {
        const numberMatch = command.match(/first number is (\d+)/);
        if (numberMatch) {
          const value = parseInt(numberMatch[1]);
          setNum1(value);
          updateCode(codeType, value, num2, year);
          stopListening();
          toast({
            title: "First Number Set",
            description: `First number set to ${value}`,
          });
        }
      }
      
      // Handle second number input
      else if (command.includes("second number is")) {
        const numberMatch = command.match(/second number is (\d+)/);
        if (numberMatch) {
          const value = parseInt(numberMatch[1]);
          setNum2(value);
          updateCode(codeType, num1, value, year);
          stopListening();
          toast({
            title: "Second Number Set",
            description: `Second number set to ${value}`,
          });
        }
      }
      
      // Handle year input for leap year
      else if (command.includes("year is")) {
        const yearMatch = command.match(/year is (\d+)/);
        if (yearMatch) {
          const value = parseInt(yearMatch[1]);
          setYear(value);
          updateCode(codeType, num1, num2, value);
          stopListening();
          toast({
            title: "Year Set",
            description: `Year set to ${value}`,
          });
        }
      }
      
      // Handle variable creation
      else if (command.includes("create") && command.includes("variable")) {
        const variableParts = command.match(/variable\s+(\w+)\s+equal\s+to\s+(\d+)/);
        if (variableParts) {
          const [_, varName, value] = variableParts;
          const newCode = `let ${varName} = ${value}; // Creating variable ${varName}\n`;
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
          const newCode = `function ${funcName}() {\n  console.log("${funcName} function executed");\n}\n`;
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
        const newCode = `console.log("${message}"); // Output: ${message}\n`;
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
  }, [transcript, isListening, stopListening, toast, num1, num2, year, codeType, language]);

  const getCodeTemplate = (type: string, lang: string): string => {
    if (lang === "javascript") {
      switch (type) {
        case "sum":
          return `// Program to add two numbers
let number1 = ${num1 ?? '_____'}; // First number
let number2 = ${num2 ?? '_____'}; // Second number

// Calculate sum
let sum = number1 + number2;

// Display result
console.log(\`Sum of \${number1} and \${number2} is: \${sum}\`);
`;
        case "multiplication":
          return `// Program to multiply two numbers
let number1 = ${num1 ?? '_____'}; // First number
let number2 = ${num2 ?? '_____'}; // Second number

// Calculate product
let product = number1 * number2;

// Display result
console.log(\`Product of \${number1} and \${number2} is: \${product}\`);
`;
        case "division":
          return `// Program to divide two numbers
let number1 = ${num1 ?? '_____'}; // First number (dividend)
let number2 = ${num2 ?? '_____'}; // Second number (divisor)

// Check if divisor is not zero
if (number2 === 0) {
  console.log("Error: Division by zero is not allowed");
} else {
  // Calculate quotient
  let quotient = number1 / number2;
  
  // Display result
  console.log(\`Division of \${number1} by \${number2} is: \${quotient}\`);
}
`;
        case "leapyear":
          return `// Program to check if a year is a leap year
let year = ${year ?? '_____'};

// Check if the year is a leap year
let isLeapYear = false;

if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
  isLeapYear = true;
}

// Display result
if (isLeapYear) {
  console.log(\`\${year} is a leap year\`);
} else {
  console.log(\`\${year} is not a leap year\`);
}
`;
        default:
          return "// Your code will appear here...";
      }
    } else if (lang === "python") {
      switch (type) {
        case "sum":
          return `# Program to add two numbers
number1 = ${num1 ?? '_____'}  # First number
number2 = ${num2 ?? '_____'}  # Second number

# Calculate sum
sum = number1 + number2

# Display result
print(f"Sum of {number1} and {number2} is: {sum}")
`;
        case "multiplication":
          return `# Program to multiply two numbers
number1 = ${num1 ?? '_____'}  # First number
number2 = ${num2 ?? '_____'}  # Second number

# Calculate product
product = number1 * number2

# Display result
print(f"Product of {number1} and {number2} is: {product}")
`;
        case "division":
          return `# Program to divide two numbers
number1 = ${num1 ?? '_____'}  # First number (dividend)
number2 = ${num2 ?? '_____'}  # Second number (divisor)

# Check if divisor is not zero
if number2 == 0:
    print("Error: Division by zero is not allowed")
else:
    # Calculate quotient
    quotient = number1 / number2
    
    # Display result
    print(f"Division of {number1} by {number2} is: {quotient}")
`;
        case "leapyear":
          return `# Program to check if a year is a leap year
year = ${year ?? '_____'}

# Check if the year is a leap year
is_leap_year = False

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    is_leap_year = True

# Display result
if is_leap_year:
    print(f"{year} is a leap year")
else:
    print(f"{year} is not a leap year")
`;
        default:
          return "# Your code will appear here...";
      }
    } else if (lang === "java") {
      switch (type) {
        case "sum":
          return `// Program to add two numbers
public class Main {
    public static void main(String[] args) {
        int number1 = ${num1 ?? 0}; // First number
        int number2 = ${num2 ?? 0}; // Second number

        // Calculate sum
        int sum = number1 + number2;

        // Display result
        System.out.println("Sum of " + number1 + " and " + number2 + " is: " + sum);
    }
}
`;
        case "multiplication":
          return `// Program to multiply two numbers
public class Main {
    public static void main(String[] args) {
        int number1 = ${num1 ?? 0}; // First number
        int number2 = ${num2 ?? 0}; // Second number

        // Calculate product
        int product = number1 * number2;

        // Display result
        System.out.println("Product of " + number1 + " and " + number2 + " is: " + product);
    }
}
`;
        case "division":
          return `// Program to divide two numbers
public class Main {
    public static void main(String[] args) {
        int number1 = ${num1 ?? 0}; // First number (dividend)
        int number2 = ${num2 ?? 0}; // Second number (divisor)

        // Check if divisor is not zero
        if (number2 == 0) {
            System.out.println("Error: Division by zero is not allowed");
        } else {
            // Calculate quotient
            double quotient = (double) number1 / number2;
            
            // Display result
            System.out.println("Division of " + number1 + " by " + number2 + " is: " + quotient);
        }
    }
}
`;
        case "leapyear":
          return `// Program to check if a year is a leap year
public class Main {
    public static void main(String[] args) {
        int year = ${year ?? 2000};

        // Check if the year is a leap year
        boolean isLeapYear = false;

        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            isLeapYear = true;
        }

        // Display result
        if (isLeapYear) {
            System.out.println(year + " is a leap year");
        } else {
            System.out.println(year + " is not a leap year");
        }
    }
}
`;
        default:
          return "// Your code will appear here...";
      }
    } else if (lang === "c") {
      switch (type) {
        case "sum":
          return `// Program to add two numbers
#include <stdio.h>

int main() {
    int number1 = ${num1 ?? 0}; // First number
    int number2 = ${num2 ?? 0}; // Second number

    // Calculate sum
    int sum = number1 + number2;

    // Display result
    printf("Sum of %d and %d is: %d\\n", number1, number2, sum);
    return 0;
}
`;
        case "multiplication":
          return `// Program to multiply two numbers
#include <stdio.h>

int main() {
    int number1 = ${num1 ?? 0}; // First number
    int number2 = ${num2 ?? 0}; // Second number

    // Calculate product
    int product = number1 * number2;

    // Display result
    printf("Product of %d and %d is: %d\\n", number1, number2, product);
    return 0;
}
`;
        case "division":
          return `// Program to divide two numbers
#include <stdio.h>

int main() {
    int number1 = ${num1 ?? 0}; // First number (dividend)
    int number2 = ${num2 ?? 0}; // Second number (divisor)

    // Check if divisor is not zero
    if (number2 == 0) {
        printf("Error: Division by zero is not allowed\\n");
    } else {
        // Calculate quotient
        float quotient = (float) number1 / number2;
        
        // Display result
        printf("Division of %d by %d is: %.2f\\n", number1, number2, quotient);
    }
    return 0;
}
`;
        case "leapyear":
          return `// Program to check if a year is a leap year
#include <stdio.h>

int main() {
    int year = ${year ?? 2000};

    // Check if the year is a leap year
    int isLeapYear = 0;

    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        isLeapYear = 1;
    }

    // Display result
    if (isLeapYear) {
        printf("%d is a leap year\\n", year);
    } else {
        printf("%d is not a leap year\\n", year);
    }
    return 0;
}
`;
        default:
          return "// Your code will appear here...";
      }
    } else if (lang === "csharp") {
      switch (type) {
        case "sum":
          return `// Program to add two numbers
using System;

class Program {
    static void Main() {
        int number1 = ${num1 ?? 0}; // First number
        int number2 = ${num2 ?? 0}; // Second number

        // Calculate sum
        int sum = number1 + number2;

        // Display result
        Console.WriteLine($"Sum of {number1} and {number2} is: {sum}");
    }
}
`;
        case "multiplication":
          return `// Program to multiply two numbers
using System;

class Program {
    static void Main() {
        int number1 = ${num1 ?? 0}; // First number
        int number2 = ${num2 ?? 0}; // Second number

        // Calculate product
        int product = number1 * number2;

        // Display result
        Console.WriteLine($"Product of {number1} and {number2} is: {product}");
    }
}
`;
        case "division":
          return `// Program to divide two numbers
using System;

class Program {
    static void Main() {
        int number1 = ${num1 ?? 0}; // First number (dividend)
        int number2 = ${num2 ?? 0}; // Second number (divisor)

        // Check if divisor is not zero
        if (number2 == 0) {
            Console.WriteLine("Error: Division by zero is not allowed");
        } else {
            // Calculate quotient
            double quotient = (double)number1 / number2;
            
            // Display result
            Console.WriteLine($"Division of {number1} by {number2} is: {quotient}");
        }
    }
}
`;
        case "leapyear":
          return `// Program to check if a year is a leap year
using System;

class Program {
    static void Main() {
        int year = ${year ?? 2000};

        // Check if the year is a leap year
        bool isLeapYear = false;

        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            isLeapYear = true;
        }

        // Display result
        if (isLeapYear) {
            Console.WriteLine($"{year} is a leap year");
        } else {
            Console.WriteLine($"{year} is not a leap year");
        }
    }
}
`;
        default:
          return "// Your code will appear here...";
      }
    } else {
      return "// Select a language to see code examples";
    }
  };

  const updateCode = (type: string, number1: number | null, number2: number | null, yr: number | null) => {
    if (!type) return;
    
    setNum1(number1);
    setNum2(number2);
    setYear(yr);
    
    const updatedCode = getCodeTemplate(type, language);
    setCode(updatedCode);
  };

  const executeCode = () => {
    try {
      // Check if necessary inputs are provided based on code type
      if (codeType === "leapyear" && year === null) {
        toast({
          title: "Error",
          description: "Please provide a year using voice command first",
          variant: "destructive",
        });
        return;
      } else if ((codeType === "sum" || codeType === "multiplication" || codeType === "division") && 
                (num1 === null || num2 === null)) {
        toast({
          title: "Error",
          description: "Please provide both numbers using voice commands first",
          variant: "destructive",
        });
        return;
      }

      // Only execute JavaScript code
      if (language !== "javascript") {
        // For non-JavaScript languages, simulate output
        let simulatedOutput = "";
        switch (codeType) {
          case "sum":
            simulatedOutput = `Sum of ${num1} and ${num2} is: ${num1 + num2}`;
            break;
          case "multiplication":
            simulatedOutput = `Product of ${num1} and ${num2} is: ${num1 * num2}`;
            break;
          case "division":
            simulatedOutput = num2 === 0 
              ? "Error: Division by zero is not allowed" 
              : `Division of ${num1} by ${num2} is: ${num1 / num2}`;
            break;
          case "leapyear":
            const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            simulatedOutput = `${year} is ${isLeap ? 'a' : 'not a'} leap year`;
            break;
          default:
            simulatedOutput = "No output available for this code";
        }
        setOutput(simulatedOutput);
        toast({
          title: "Code Simulated",
          description: "Non-JavaScript code output simulated",
        });
        return;
      }

      // Execute JavaScript code
      console.group("Code Execution Results");
      console.log("Executing code:\n", code);
      
      // Execute in current window
      const result = new Function(code)();
      
      let expectedOutput = "";
      switch (codeType) {
        case "sum":
          expectedOutput = `Sum of ${num1} and ${num2} is: ${num1 + num2}`;
          break;
        case "multiplication":
          expectedOutput = `Product of ${num1} and ${num2} is: ${num1 * num2}`;
          break;
        case "division":
          expectedOutput = num2 === 0 
            ? "Error: Division by zero is not allowed" 
            : `Division of ${num1} by ${num2} is: ${num1 / num2}`;
          break;
        case "leapyear":
          const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
          expectedOutput = `${year} is ${isLeap ? 'a' : 'not a'} leap year`;
          break;
        default:
          expectedOutput = "";
      }
      
      const consoleOutput = result !== undefined ? String(result) : expectedOutput;
      console.log("Execution output:", consoleOutput);
      console.groupEnd();
      setOutput(consoleOutput);
      
      toast({
        title: "Code Executed",
        description: "Check the output section for results",
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

  const explainCode = () => {
    let explanation = "";
    switch (codeType) {
      case "sum":
        explanation = `This program adds two numbers. It declares two variables, number1 and number2, with values ${num1} and ${num2}. Then it calculates their sum and displays the result: ${num1} plus ${num2} equals ${num1 + num2}.`;
        break;
      case "multiplication":
        explanation = `This program multiplies two numbers. It declares two variables, number1 and number2, with values ${num1} and ${num2}. Then it calculates their product and displays the result: ${num1} times ${num2} equals ${num1 * num2}.`;
        break;
      case "division":
        explanation = `This program divides two numbers. It declares two variables, number1 and number2, with values ${num1} and ${num2}. It checks if the divisor is zero to avoid division by zero error. Then it calculates the quotient and displays the result: ${num1} divided by ${num2} equals ${num2 !== 0 ? num1 / num2 : "undefined (division by zero)"}.`;
        break;
      case "leapyear":
        explanation = `This program checks if a year is a leap year. It declares a variable 'year' with value ${year}. A year is a leap year if it's divisible by 4 but not by 100, or if it's divisible by 400. Based on these rules, ${year} ${(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? "is" : "is not"} a leap year.`;
        break;
      default:
        explanation = "Please generate a program first using voice commands.";
    }
    
    // Speak the explanation using the Web Speech API
    const utterance = new SpeechSynthesisUtterance(explanation);
    window.speechSynthesis.speak(utterance);
    
    // Show toast notification
    toast({
      title: "Code Explanation",
      description: "Listen to the explanation",
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-sm bg-white">
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
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
              <p className="text-sm text-gray-600">Example: function greet(name) {`{`} return "Hello " + name; {`}`}</p>
              <p className="text-sm text-gray-600">Usage: greet("John") outputs "Hello John"</p>
            </div>
            <div>
              <h4 className="font-medium">Console Output:</h4>
              <p className="text-sm text-gray-600">console.log displays messages in the browser console (F12).</p>
              <p className="text-sm text-gray-600">Example: console.log("Hello!");</p>
              <p className="text-sm text-gray-600">Output in console: Hello!</p>
            </div>
          </div>
        </div>
      )}

      {showExplanation && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
              <p className="text-sm text-gray-600">Output: function sayHello() {`{`} {`}`}</p>
            </div>
            <div>
              <h4 className="font-medium">Printing to Console:</h4>
              <p className="text-sm text-gray-600">Say: "Print Hello World"</p>
              <p className="text-sm text-gray-600">Output: console.log("Hello World");</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• "Write a program on sum of two numbers"</li>
          <li>• "Write a program on multiplication of two numbers"</li>
          <li>• "Write a program on division of two numbers"</li>
          <li>• "Write a program on leap year"</li>
          <li>• "First number is [value]" / "Second number is [value]" / "Year is [value]"</li>
          <li>• "Create variable [name] equal to [value]"</li>
          <li>• "Create function [name]"</li>
          <li>• "Print [message]" or "Log [message]"</li>
        </ul>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Code Editor</h3>
          <Select value={language} onValueChange={value => {
            setLanguage(value);
            if (codeType) {
              updateCode(codeType, num1, num2, year);
            }
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <pre className="bg-gray-100 p-4 rounded-lg min-h-[200px] whitespace-pre-wrap font-mono text-sm">
          {code || "// Your code will appear here...\n// Use voice commands to start coding!"}
        </pre>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <pre className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
          {output || "// Output will appear here...\n// Press 'Run Code' to see results"}
        </pre>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
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
          onClick={explainCode} 
          className="flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Explain Code
        </Button>
        <Button 
          onClick={() => {
            setCode("");
            setOutput("");
            setNum1(null);
            setNum2(null);
            setYear(null);
            setCodeType("");
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
    </div>
  );
}
