
import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Info, PlayCircle, Code as CodeIcon, Mic, MicOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CodingGame() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCodeDetails, setShowCodeDetails] = useState(false);
  const [num1, setNum1] = useState<number | null>(null);
  const [num2, setNum2] = useState<number | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const { transcript, isListening, startListening, stopListening, clearTranscript } = useVoice();
  const { toast } = useToast();
  const [isExplaining, setIsExplaining] = useState(false);
  const [syntheticallyExplaining, setSyntheticallyExplaining] = useState(false);
  const [currentProgramType, setCurrentProgramType] = useState("");

  // Handle voice commands
  useEffect(() => {
    if (transcript && isListening) {
      const command = transcript.toLowerCase().trim();
      console.log("Processing coding command:", command);
      
      // Handle program generation for sum of two numbers
      if (command.includes("write") && command.includes("program") && command.includes("sum")) {
        const sumProgram = generateProgram("sum", selectedLanguage);
        setCode(sumProgram);
        setCurrentProgramType("sum");
        setOutput("Please provide two numbers using voice commands: 'first number is X' and 'second number is Y'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the numbers using voice commands",
        });
      }
      
      // Handle program for multiplication of two numbers
      else if (command.includes("write") && command.includes("program") && command.includes("multiplication")) {
        const multiplicationProgram = generateProgram("multiplication", selectedLanguage);
        setCode(multiplicationProgram);
        setCurrentProgramType("multiplication");
        setOutput("Please provide two numbers using voice commands: 'first number is X' and 'second number is Y'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the numbers using voice commands",
        });
      }
      
      // Handle program for division of two numbers
      else if (command.includes("write") && command.includes("program") && command.includes("division")) {
        const divisionProgram = generateProgram("division", selectedLanguage);
        setCode(divisionProgram);
        setCurrentProgramType("division");
        setOutput("Please provide two numbers using voice commands: 'first number is X' and 'second number is Y'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the numbers using voice commands",
        });
      }
      
      // Handle program for sum of squares
      else if (command.includes("write") && command.includes("program") && command.includes("sum of squares")) {
        const sumOfSquaresProgram = generateProgram("sumOfSquares", selectedLanguage);
        setCode(sumOfSquaresProgram);
        setCurrentProgramType("sumOfSquares");
        setOutput("Please provide a number using voice command: 'number is X'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the number using voice commands",
        });
      }
      
      // Handle program for even or odd check
      else if (command.includes("write") && command.includes("program") && command.includes("even or odd")) {
        const evenOddProgram = generateProgram("evenOdd", selectedLanguage);
        setCode(evenOddProgram);
        setCurrentProgramType("evenOdd");
        setOutput("Please provide a number using voice command: 'number is X'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the number using voice commands",
        });
      }
      
      // Handle program for leap year check
      else if (command.includes("write") && command.includes("program") && command.includes("leap year")) {
        const leapYearProgram = generateProgram("leapYear", selectedLanguage);
        setCode(leapYearProgram);
        setCurrentProgramType("leapYear");
        setOutput("Please provide a year using voice command: 'year is X'");
        stopListening();
        toast({
          title: "Code Generated",
          description: "Now provide the year using voice commands",
        });
      }
      
      // Handle first number input
      else if (command.includes("first number is")) {
        const numberMatch = command.match(/first number is (\d+)/);
        if (numberMatch) {
          const value = parseInt(numberMatch[1]);
          setNum1(value);
          updateCodeWithValues(currentProgramType, selectedLanguage, value, num2, null, year);
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
          updateCodeWithValues(currentProgramType, selectedLanguage, num1, value, null, year);
          stopListening();
          toast({
            title: "Second Number Set",
            description: `Second number set to ${value}`,
          });
        }
      }
      
      // Handle general number input (for other programs)
      else if (command.includes("number is")) {
        const numberMatch = command.match(/number is (\d+)/);
        if (numberMatch) {
          const inputValue = parseInt(numberMatch[1]);
          setValue(inputValue);
          updateCodeWithValues(currentProgramType, selectedLanguage, num1, num2, inputValue, year);
          stopListening();
          toast({
            title: "Number Set",
            description: `Number set to ${inputValue}`,
          });
        }
      }
      
      // Handle year input (for leap year program)
      else if (command.includes("year is")) {
        const yearMatch = command.match(/year is (\d+)/);
        if (yearMatch) {
          const inputYear = parseInt(yearMatch[1]);
          setYear(inputYear);
          updateCodeWithValues(currentProgramType, selectedLanguage, num1, num2, value, inputYear);
          stopListening();
          toast({
            title: "Year Set",
            description: `Year set to ${inputYear}`,
          });
        }
      }
      
      // Handle variable creation
      else if (command.includes("create") && command.includes("variable")) {
        const variableParts = command.match(/variable\s+(\w+)\s+equal\s+to\s+(\d+)/);
        if (variableParts) {
          const [_, varName, value] = variableParts;
          const newCode = getVariableDeclaration(selectedLanguage, varName, value);
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
          const newCode = getFunctionDeclaration(selectedLanguage, funcName);
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
        const newCode = getPrintStatement(selectedLanguage, message);
        setCode(prev => prev + newCode);
        console.log(`Added print statement for message: ${message}`);
        setOutput(`Added print statement`);
        stopListening();
        toast({
          title: "Code Created",
          description: "Added print statement",
        });
      }
    }
  }, [transcript, isListening, stopListening, toast, num1, num2, value, year, code, currentProgramType, selectedLanguage]);

  // Generate program based on type and language
  const generateProgram = (type: string, language: string) => {
    switch (type) {
      case "sum":
        return getAdditionProgram(language);
      case "multiplication":
        return getMultiplicationProgram(language);
      case "division":
        return getDivisionProgram(language);
      case "sumOfSquares":
        return getSumOfSquaresProgram(language);
      case "evenOdd":
        return getEvenOddProgram(language);
      case "leapYear":
        return getLeapYearProgram(language);
      default:
        return "";
    }
  };

  // Update code with user-provided values
  const updateCodeWithValues = (
    type: string, 
    language: string, 
    number1: number | null, 
    number2: number | null, 
    singleNumber: number | null,
    yearValue: number | null
  ) => {
    switch (type) {
      case "sum":
        setCode(getAdditionProgram(language, number1, number2));
        break;
      case "multiplication":
        setCode(getMultiplicationProgram(language, number1, number2));
        break;
      case "division":
        setCode(getDivisionProgram(language, number1, number2));
        break;
      case "sumOfSquares":
        setCode(getSumOfSquaresProgram(language, singleNumber));
        break;
      case "evenOdd":
        setCode(getEvenOddProgram(language, singleNumber));
        break;
      case "leapYear":
        setCode(getLeapYearProgram(language, yearValue));
        break;
      default:
        break;
    }
  };

  // Get addition program in different languages
  const getAdditionProgram = (language: string, num1Val: number | null = null, num2Val: number | null = null) => {
    switch (language) {
      case "javascript":
        return `// Program to add two numbers
let number1 = ${num1Val ?? '_____'}; // First number
let number2 = ${num2Val ?? '_____'}; // Second number

// Calculate sum
let sum = number1 + number2;

// Display result
console.log(\`Sum of \${number1} and \${number2} is: \${sum}\`);
`;
      case "python":
        return `# Program to add two numbers
number1 = ${num1Val ?? '_____'}  # First number
number2 = ${num2Val ?? '_____'}  # Second number

# Calculate sum
sum = number1 + number2

# Display result
print(f"Sum of {number1} and {number2} is: {sum}")
`;
      case "java":
        return `// Program to add two numbers
public class Addition {
    public static void main(String[] args) {
        int number1 = ${num1Val ?? 0}; // First number
        int number2 = ${num2Val ?? 0}; // Second number
        
        // Calculate sum
        int sum = number1 + number2;
        
        // Display result
        System.out.println("Sum of " + number1 + " and " + number2 + " is: " + sum);
    }
}
`;
      case "c":
        return `// Program to add two numbers
#include <stdio.h>

int main() {
    int number1 = ${num1Val ?? 0}; // First number
    int number2 = ${num2Val ?? 0}; // Second number
    
    // Calculate sum
    int sum = number1 + number2;
    
    // Display result
    printf("Sum of %d and %d is: %d\\n", number1, number2, sum);
    
    return 0;
}
`;
      default:
        return `// Program to add two numbers
let number1 = ${num1Val ?? '_____'}; // First number
let number2 = ${num2Val ?? '_____'}; // Second number

// Calculate sum
let sum = number1 + number2;

// Display result
console.log(\`Sum of \${number1} and \${number2} is: \${sum}\`);
`;
    }
  };

  // Get multiplication program in different languages
  const getMultiplicationProgram = (language: string, num1Val: number | null = null, num2Val: number | null = null) => {
    switch (language) {
      case "javascript":
        return `// Program to multiply two numbers
let number1 = ${num1Val ?? '_____'}; // First number
let number2 = ${num2Val ?? '_____'}; // Second number

// Calculate product
let product = number1 * number2;

// Display result
console.log(\`Product of \${number1} and \${number2} is: \${product}\`);
`;
      case "python":
        return `# Program to multiply two numbers
number1 = ${num1Val ?? '_____'}  # First number
number2 = ${num2Val ?? '_____'}  # Second number

# Calculate product
product = number1 * number2

# Display result
print(f"Product of {number1} and {number2} is: {product}")
`;
      case "java":
        return `// Program to multiply two numbers
public class Multiplication {
    public static void main(String[] args) {
        int number1 = ${num1Val ?? 0}; // First number
        int number2 = ${num2Val ?? 0}; // Second number
        
        // Calculate product
        int product = number1 * number2;
        
        // Display result
        System.out.println("Product of " + number1 + " and " + number2 + " is: " + product);
    }
}
`;
      case "c":
        return `// Program to multiply two numbers
#include <stdio.h>

int main() {
    int number1 = ${num1Val ?? 0}; // First number
    int number2 = ${num2Val ?? 0}; // Second number
    
    // Calculate product
    int product = number1 * number2;
    
    // Display result
    printf("Product of %d and %d is: %d\\n", number1, number2, product);
    
    return 0;
}
`;
      default:
        return `// Program to multiply two numbers
let number1 = ${num1Val ?? '_____'}; // First number
let number2 = ${num2Val ?? '_____'}; // Second number

// Calculate product
let product = number1 * number2;

// Display result
console.log(\`Product of \${number1} and \${number2} is: \${product}\`);
`;
    }
  };

  // Get division program in different languages
  const getDivisionProgram = (language: string, num1Val: number | null = null, num2Val: number | null = null) => {
    switch (language) {
      case "javascript":
        return `// Program to divide two numbers
let number1 = ${num1Val ?? '_____'}; // Dividend
let number2 = ${num2Val ?? '_____'}; // Divisor

// Check for division by zero
let quotient = number2 !== 0 ? number1 / number2 : "Error: Division by zero";

// Display result
if (typeof quotient === "number") {
  console.log(\`Division of \${number1} by \${number2} is: \${quotient.toFixed(2)}\`);
} else {
  console.log(quotient); // Error message
}
`;
      case "python":
        return `# Program to divide two numbers
number1 = ${num1Val ?? '_____'}  # Dividend
number2 = ${num2Val ?? '_____'}  # Divisor

# Check for division by zero
try:
    quotient = number1 / number2
    # Display result
    print(f"Division of {number1} by {number2} is: {quotient:.2f}")
except ZeroDivisionError:
    print("Error: Division by zero")
`;
      case "java":
        return `// Program to divide two numbers
public class Division {
    public static void main(String[] args) {
        double number1 = ${num1Val ?? 0.0}; // Dividend
        double number2 = ${num2Val ?? 0.0}; // Divisor
        
        // Check for division by zero
        if (number2 != 0) {
            // Calculate quotient
            double quotient = number1 / number2;
            
            // Display result
            System.out.printf("Division of %.2f by %.2f is: %.2f%n", number1, number2, quotient);
        } else {
            System.out.println("Error: Division by zero");
        }
    }
}
`;
      case "c":
        return `// Program to divide two numbers
#include <stdio.h>

int main() {
    double number1 = ${num1Val ?? 0.0}; // Dividend
    double number2 = ${num2Val ?? 0.0}; // Divisor
    
    // Check for division by zero
    if (number2 != 0) {
        // Calculate quotient
        double quotient = number1 / number2;
        
        // Display result
        printf("Division of %.2f by %.2f is: %.2f\\n", number1, number2, quotient);
    } else {
        printf("Error: Division by zero\\n");
    }
    
    return 0;
}
`;
      default:
        return `// Program to divide two numbers
let number1 = ${num1Val ?? '_____'}; // Dividend
let number2 = ${num2Val ?? '_____'}; // Divisor

// Check for division by zero
let quotient = number2 !== 0 ? number1 / number2 : "Error: Division by zero";

// Display result
if (typeof quotient === "number") {
  console.log(\`Division of \${number1} by \${number2} is: \${quotient.toFixed(2)}\`);
} else {
  console.log(quotient); // Error message
}
`;
    }
  };

  // Get sum of squares program in different languages
  const getSumOfSquaresProgram = (language: string, value: number | null = null) => {
    switch (language) {
      case "javascript":
        return `// Program to calculate sum of squares
let number = ${value ?? '_____'}; // Input number
let sum = 0;

// Calculate sum of squares from 1 to number
for (let i = 1; i <= number; i++) {
  sum += i * i;
}

// Display result
console.log(\`Sum of squares from 1 to \${number} is: \${sum}\`);
`;
      case "python":
        return `# Program to calculate sum of squares
number = ${value ?? '_____'}  # Input number
sum = 0

# Calculate sum of squares from 1 to number
for i in range(1, number + 1):
    sum += i * i

# Display result
print(f"Sum of squares from 1 to {number} is: {sum}")
`;
      case "java":
        return `// Program to calculate sum of squares
public class SumOfSquares {
    public static void main(String[] args) {
        int number = ${value ?? 0}; // Input number
        int sum = 0;
        
        // Calculate sum of squares from 1 to number
        for (int i = 1; i <= number; i++) {
            sum += i * i;
        }
        
        // Display result
        System.out.println("Sum of squares from 1 to " + number + " is: " + sum);
    }
}
`;
      case "c":
        return `// Program to calculate sum of squares
#include <stdio.h>

int main() {
    int number = ${value ?? 0}; // Input number
    int sum = 0;
    
    // Calculate sum of squares from 1 to number
    for (int i = 1; i <= number; i++) {
        sum += i * i;
    }
    
    // Display result
    printf("Sum of squares from 1 to %d is: %d\\n", number, sum);
    
    return 0;
}
`;
      default:
        return `// Program to calculate sum of squares
let number = ${value ?? '_____'}; // Input number
let sum = 0;

// Calculate sum of squares from 1 to number
for (let i = 1; i <= number; i++) {
  sum += i * i;
}

// Display result
console.log(\`Sum of squares from 1 to \${number} is: \${sum}\`);
`;
    }
  };

  // Get even or odd program in different languages
  const getEvenOddProgram = (language: string, value: number | null = null) => {
    switch (language) {
      case "javascript":
        return `// Program to check if a number is even or odd
let number = ${value ?? '_____'}; // Input number

// Check if even or odd
let result = number % 2 === 0 ? 'even' : 'odd';

// Display result
console.log(\`The number \${number} is \${result}\`);
`;
      case "python":
        return `# Program to check if a number is even or odd
number = ${value ?? '_____'}  # Input number

# Check if even or odd
result = 'even' if number % 2 == 0 else 'odd'

# Display result
print(f"The number {number} is {result}")
`;
      case "java":
        return `// Program to check if a number is even or odd
public class EvenOdd {
    public static void main(String[] args) {
        int number = ${value ?? 0}; // Input number
        
        // Check if even or odd
        String result = (number % 2 == 0) ? "even" : "odd";
        
        // Display result
        System.out.println("The number " + number + " is " + result);
    }
}
`;
      case "c":
        return `// Program to check if a number is even or odd
#include <stdio.h>

int main() {
    int number = ${value ?? 0}; // Input number
    
    // Check if even or odd
    char* result = (number % 2 == 0) ? "even" : "odd";
    
    // Display result
    printf("The number %d is %s\\n", number, result);
    
    return 0;
}
`;
      default:
        return `// Program to check if a number is even or odd
let number = ${value ?? '_____'}; // Input number

// Check if even or odd
let result = number % 2 === 0 ? 'even' : 'odd';

// Display result
console.log(\`The number \${number} is \${result}\`);
`;
    }
  };

  // Get leap year program in different languages
  const getLeapYearProgram = (language: string, year: number | null = null) => {
    switch (language) {
      case "javascript":
        return `// Program to check if a year is a leap year
let year = ${year ?? '_____'}; // Input year

// Check if it's a leap year
let isLeapYear = false;

if (year % 4 === 0) {
  if (year % 100 === 0) {
    // Year is divisible by 100, check if it's divisible by 400
    isLeapYear = year % 400 === 0;
  } else {
    // Year is divisible by 4 but not by 100
    isLeapYear = true;
  }
}

// Display result
if (isLeapYear) {
  console.log(\`\${year} is a leap year\`);
} else {
  console.log(\`\${year} is not a leap year\`);
}
`;
      case "python":
        return `# Program to check if a year is a leap year
year = ${year ?? '_____'}  # Input year

# Check if it's a leap year
if (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):
    print(f"{year} is a leap year")
else:
    print(f"{year} is not a leap year")
`;
      case "java":
        return `// Program to check if a year is a leap year
public class LeapYear {
    public static void main(String[] args) {
        int year = ${year ?? 0}; // Input year
        boolean isLeapYear = false;
        
        // Check if it's a leap year
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                // Year is divisible by 100, check if it's divisible by 400
                isLeapYear = (year % 400 == 0);
            } else {
                // Year is divisible by 4 but not by 100
                isLeapYear = true;
            }
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
      case "c":
        return `// Program to check if a year is a leap year
#include <stdio.h>
#include <stdbool.h>

int main() {
    int year = ${year ?? 0}; // Input year
    bool isLeapYear = false;
    
    // Check if it's a leap year
    if (year % 4 == 0) {
        if (year % 100 == 0) {
            // Year is divisible by 100, check if it's divisible by 400
            isLeapYear = (year % 400 == 0);
        } else {
            // Year is divisible by 4 but not by 100
            isLeapYear = true;
        }
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
        return `// Program to check if a year is a leap year
let year = ${year ?? '_____'}; // Input year

// Check if it's a leap year
let isLeapYear = false;

if (year % 4 === 0) {
  if (year % 100 === 0) {
    // Year is divisible by 100, check if it's divisible by 400
    isLeapYear = year % 400 === 0;
  } else {
    // Year is divisible by 4 but not by 100
    isLeapYear = true;
  }
}

// Display result
if (isLeapYear) {
  console.log(\`\${year} is a leap year\`);
} else {
  console.log(\`\${year} is not a leap year\`);
}
`;
    }
  };

  // Helper functions for variable declaration in different languages
  const getVariableDeclaration = (language: string, varName: string, value: string) => {
    switch (language) {
      case "javascript":
        return `let ${varName} = ${value}; // Creating variable ${varName}\n`;
      case "python":
        return `${varName} = ${value}  # Creating variable ${varName}\n`;
      case "java":
        return `int ${varName} = ${value}; // Creating variable ${varName}\n`;
      case "c":
        return `int ${varName} = ${value}; // Creating variable ${varName}\n`;
      default:
        return `let ${varName} = ${value}; // Creating variable ${varName}\n`;
    }
  };

  // Helper functions for function declaration in different languages
  const getFunctionDeclaration = (language: string, funcName: string) => {
    switch (language) {
      case "javascript":
        return `function ${funcName}() {\n  console.log("${funcName} function executed");\n}\n`;
      case "python":
        return `def ${funcName}():\n  print("${funcName} function executed")\n\n`;
      case "java":
        return `public void ${funcName}() {\n  System.out.println("${funcName} function executed");\n}\n`;
      case "c":
        return `void ${funcName}() {\n  printf("${funcName} function executed\\n");\n}\n`;
      default:
        return `function ${funcName}() {\n  console.log("${funcName} function executed");\n}\n`;
    }
  };

  // Helper functions for print statements in different languages
  const getPrintStatement = (language: string, message: string) => {
    switch (language) {
      case "javascript":
        return `console.log("${message}"); // Output: ${message}\n`;
      case "python":
        return `print("${message}")  # Output: ${message}\n`;
      case "java":
        return `System.out.println("${message}"); // Output: ${message}\n`;
      case "c":
        return `printf("${message}\\n"); // Output: ${message}\n`;
      default:
        return `console.log("${message}"); // Output: ${message}\n`;
    }
  };

  const executeCode = () => {
    try {
      // For sum program
      if ((code.includes("// Program to add two numbers") || code.includes("# Program to add two numbers")) && (num1 === null || num2 === null)) {
        toast({
          title: "Error",
          description: "Please provide both numbers using voice commands first",
          variant: "destructive",
        });
        return;
      }
      
      // For multiplication/division program
      if ((code.includes("multiply two numbers") || code.includes("divide two numbers")) && (num1 === null || num2 === null)) {
        toast({
          title: "Error",
          description: "Please provide both numbers using voice commands first",
          variant: "destructive",
        });
        return;
      }
      
      // For sum of squares and even/odd programs
      if ((code.includes("sum of squares") || code.includes("even or odd")) && value === null) {
        toast({
          title: "Error",
          description: "Please provide a number using voice commands first",
          variant: "destructive",
        });
        return;
      }
      
      // For leap year program
      if (code.includes("leap year") && year === null) {
        toast({
          title: "Error",
          description: "Please provide a year using voice commands first",
          variant: "destructive",
        });
        return;
      }

      console.group("Code Execution Results");
      console.log("Executing code:\n", code);
      
      // Capture console.log output
      const originalConsoleLog = console.log;
      let logOutput = "";
      
      console.log = function() {
        // Convert all arguments to strings and join them
        const args = Array.from(arguments).map(arg => String(arg));
        const message = args.join(' ');
        logOutput += message + '\n';
        originalConsoleLog.apply(console, arguments);
      };
      
      // Execute in current window context - only for JavaScript code
      if (selectedLanguage === "javascript") {
        try {
          new Function(code)();
        } catch (error) {
          console.error("Execution error:", error);
          logOutput = `Error: ${error.message}`;
        }
      } else {
        // For non-JavaScript languages, show a simulated output
        logOutput = getSimulatedOutput();
      }
      
      // Restore original console.log
      console.log = originalConsoleLog;
      
      console.groupEnd();
      setOutput(logOutput || "Execution completed, but no output was generated.");
      
      // Always stop listening after executing code
      stopListening();
      
      toast({
        title: "Code Executed",
        description: "Check the output section for results",
      });
    } catch (error) {
      console.error("Code execution error:", error);
      setOutput(`Error: ${error.message}`);
      stopListening();
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Generate simulated output for non-JavaScript languages
  const getSimulatedOutput = () => {
    if (selectedLanguage === "python" || selectedLanguage === "java" || selectedLanguage === "c") {
      switch (currentProgramType) {
        case "sum":
          if (num1 !== null && num2 !== null) {
            return `Sum of ${num1} and ${num2} is: ${num1 + num2}`;
          }
          break;
        case "multiplication":
          if (num1 !== null && num2 !== null) {
            return `Product of ${num1} and ${num2} is: ${num1 * num2}`;
          }
          break;
        case "division":
          if (num1 !== null && num2 !== null) {
            if (num2 === 0) {
              return "Error: Division by zero";
            }
            return `Division of ${num1} by ${num2} is: ${(num1 / num2).toFixed(2)}`;
          }
          break;
        case "sumOfSquares":
          if (value !== null) {
            let sum = 0;
            for (let i = 1; i <= value; i++) {
              sum += i * i;
            }
            return `Sum of squares from 1 to ${value} is: ${sum}`;
          }
          break;
        case "evenOdd":
          if (value !== null) {
            return `The number ${value} is ${value % 2 === 0 ? 'even' : 'odd'}`;
          }
          break;
        case "leapYear":
          if (year !== null) {
            let isLeapYear = false;
            if (year % 4 === 0) {
              if (year % 100 === 0) {
                isLeapYear = year % 400 === 0;
              } else {
                isLeapYear = true;
              }
            }
            return `${year} is ${isLeapYear ? '' : 'not '}a leap year`;
          }
          break;
        default:
          return "Simulated output for non-JavaScript code";
      }
    }
    return "Please provide all required values to see the output";
  };

  const explainCode = () => {
    // Cancel any ongoing explanation
    if (isExplaining) {
      window.speechSynthesis.cancel();
      setIsExplaining(false);
      setSyntheticallyExplaining(false);
      return;
    }

    setIsExplaining(true);
    setSyntheticallyExplaining(true);

    let explanation = "";

    if (code.includes("add two numbers") || code.includes("sum")) {
      explanation = "This program adds two numbers together. It declares two variables, number1 and number2, and then calculates their sum using the plus operator. Finally, it displays the result.";
    } else if (code.includes("multiply")) {
      explanation = "This program multiplies two numbers. It declares two variables, number1 and number2, and then calculates their product using the multiplication operator. The result is displayed at the end.";
    } else if (code.includes("divide")) {
      explanation = "This program divides two numbers. It first checks if the divisor is zero to avoid division by zero errors. If the divisor is not zero, it performs the division and displays the result with two decimal places.";
    } else if (code.includes("sum of squares")) {
      explanation = "This program calculates the sum of squares from 1 to a given number. It initializes a variable 'sum' to zero, then uses a for loop to iterate from 1 to the input number. For each number in that range, it squares the number and adds it to the running sum. Finally, it displays the result.";
    } else if (code.includes("even or odd")) {
      explanation = "This program checks if a number is even or odd. It uses the modulo operator to determine if the number is divisible by 2 with no remainder. If the remainder is 0, the number is even; otherwise, it's odd. The program uses a ternary operator to set the result variable and then displays the outcome.";
    } else if (code.includes("leap year")) {
      explanation = "This program checks if a year is a leap year. A leap year is divisible by 4, except for century years which must be divisible by 400. The program first checks if the year is divisible by 4. If it is, it then checks if it's a century year (divisible by 100). For century years, it needs to be divisible by 400 to be a leap year.";
    } else {
      explanation = "This code " + code.replace(/\/\//g, "").replace(/\n/g, ". ").replace(/;/g, "");
    }

    const utterance = new SpeechSynthesisUtterance(explanation);
    utterance.onend = () => {
      setIsExplaining(false);
      setSyntheticallyExplaining(false);
    };
    
    window.speechSynthesis.speak(utterance);
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
            <div>
              <h4 className="font-medium">Programming Examples:</h4>
              <p className="text-sm text-gray-600">Say: "Write a program on sum of two numbers"</p>
              <p className="text-sm text-gray-600">Say: "Write a program on multiplication of two numbers"</p>
              <p className="text-sm text-gray-600">Say: "Write a program on division of two numbers"</p>
              <p className="text-sm text-gray-600">Say: "Write a program on sum of squares"</p>
              <p className="text-sm text-gray-600">Say: "Write a program on even or odd number"</p>
              <p className="text-sm text-gray-600">Say: "Write a program on leap year"</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Language:</h3>
          <Select
            value={selectedLanguage}
            onValueChange={(value) => {
              setSelectedLanguage(value);
              // Update the code with the new language
              updateCodeWithValues(currentProgramType, value, num1, num2, value, year);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c">C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Voice Commands</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• "Create variable [name] equal to [value]"</li>
          <li>• "Create function [name]"</li>
          <li>• "Print [message]" or "Log [message]"</li>
          <li>• "Write a program on sum of two numbers"</li>
          <li>• "Write a program on multiplication of two numbers"</li>
          <li>• "Write a program on division of two numbers"</li>
          <li>• "Write a program on sum of squares"</li>
          <li>• "Write a program on even or odd number"</li>
          <li>• "Write a program on leap year"</li>
          <li>• "First number is [number]" and "Second number is [number]"</li>
          <li>• "Number is [number]" (for sum of squares and even/odd programs)</li>
          <li>• "Year is [number]" (for leap year program)</li>
        </ul>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Code Editor</h3>
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

      <div className="flex gap-4 justify-center flex-wrap">
        <Button
          onClick={startListening}
          disabled={isListening}
          className="bg-primary flex items-center gap-2"
        >
          <Mic className="w-4 h-4" />
          Start Speaking
        </Button>
        
        <Button
          onClick={stopListening}
          disabled={!isListening}
          className="bg-secondary flex items-center gap-2"
        >
          <MicOff className="w-4 h-4" />
          Stop Speaking
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
          variant={isExplaining ? "secondary" : "outline"}
          className="flex items-center gap-2"
        >
          <Info className="w-4 h-4" />
          {isExplaining ? "Stop Explanation" : "Explain Code"}
        </Button>
        
        <Button 
          onClick={() => {
            setCode("");
            setOutput("");
            setNum1(null);
            setNum2(null);
            setValue(null);
            setYear(null);
            setCurrentProgramType("");
            clearTranscript();
          }} 
          variant="outline"
        >
          Clear Code
        </Button>
      </div>

      {isListening && (
        <div className="mt-4 text-center">
          <div className="inline-block px-4 py-2 bg-secondary/20 rounded-full text-sm text-secondary animate-pulse">
            Listening... Say your command!
          </div>
        </div>
      )}
      
      {syntheticallyExplaining && (
        <div className="mt-4 text-center">
          <div className="inline-block px-4 py-2 bg-accent/20 rounded-full text-sm text-accent animate-pulse">
            Explaining code...
          </div>
        </div>
      )}
      
      {transcript && (
        <p className="text-center mt-2 text-sm text-gray-600">
          Heard: {transcript}
        </p>
      )}
    </div>
  );
}
