import { useState, useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define voice commands for the coding game
const commands = {
  createVariable: /create\s+(?:a\s+)?variable\s+(\w+)\s+(?:equal\s+to|equals|=)\s+(.+)/i,
  createFunction: /create\s+(?:a\s+)?function\s+(\w+)/i,
  print: /print\s+(.+)/i,
  runCode: /run\s+(?:the\s+)?code/i,
  clearCode: /clear\s+(?:the\s+)?code/i,
  help: /(?:show|tell\s+me)\s+(?:the\s+)?commands/i,
  setInput: /(?:set|input)\s+(\w+)\s+(?:to|as|equals?)\s+(.+)/i,
  multiplicationProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+multiplication\s+(?:of\s+)?(?:two)\s+numbers/i,
  divisionProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+division\s+(?:of\s+)?(?:two)?\s+numbers/i,
  leapYearProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+leap\s+year/i,
  evenOddProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+even\s+or\s+odd/i,
  primeNumberProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+prime\s+number/i,
  firstNumber: /(?:first|1st)\s+number\s+(?:is|equals?|=)?\s+(\d+)/i,
  secondNumber: /(?:second|2nd)\s+number\s+(?:is|equals?|=)?\s+(\d+)/i,
  setNumber: /(?:number|num|year)\s+(?:is|equals?|=)?\s+(\d+)/i,
  additionProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+addition\s+(?:of\s+)?(?:two)\s+numbers/i,
  lcmProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+lcm\s+(?:of\s+)?(?:two)\s+numbers/i,
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
  resize: "none" as const, // Fix the type error by using 'as const'
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

// Program templates in different languages
const programTemplates = {
  javascript: {
    multiplication: `// Multiplication of two numbers
function multiply(a, b) {
  return a * b;
}

// Get user inputs
let num1 = 0; // You can set this via voice with "first number is <value>"
let num2 = 0; // You can set this via voice with "second number is <value>"

// Calculate the result
const result = multiply(num1, num2);

// Display the result
console.log(\`\${num1} × \${num2} = \${result}\`);`,

    division: `// Division of two numbers
function divide(a, b) {
  if (b === 0) {
    return "Error: Division by zero is not allowed";
  }
  return a / b;
}

// Get user inputs
let num1 = 0; // You can set this via voice with "first number is <value>"
let num2 = 1; // You can set this via voice with "second number is <value>"

// Calculate the result
const result = divide(num1, num2);

// Display the result
console.log(\`\${num1} ÷ \${num2} = \${result}\`);`,

    leapYear: `// Check if a year is a leap year
function isLeapYear(year) {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }
  return false;
}

// Get user input
let year = 2024; // You can set this via voice with "set year to <value>"

// Check if it's a leap year
const result = isLeapYear(year);

// Display the result
if (result) {
  console.log(\`\${year} is a leap year\`);
} else {
  console.log(\`\${year} is not a leap year\`);
}`,

    evenOdd: `// Check if a number is even or odd
function checkEvenOdd(num) {
  if (num % 2 === 0) {
    return "even";
  } else {
    return "odd";
  }
}

// Get user input
let number = 0; // You can set this via voice with "set number to <value>"

// Check if it's even or odd
const result = checkEvenOdd(number);

// Display the result
console.log(\`\${number} is \${result}\`);`,

    primeNumber: `// Check if a number is prime
function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  
  return true;
}

// Get user input
let number = 7; // You can set this via voice with "set number to <value>"

// Check if it's a prime number
const result = isPrime(number);

// Display the result
if (result) {
  console.log(\`\${number} is a prime number\`);
} else {
  console.log(\`\${number} is not a prime number\`);
}`,
    
    addition: `// Addition of two numbers
function add(a, b) {
  return a + b;
}

// Get user inputs
let num1 = 0; // You can set this via voice with "first number is <value>"
let num2 = 0; // You can set this via voice with "second number is <value>"

// Calculate the result
const result = add(num1, num2);

// Display the result
console.log(\`\${num1} + \${num2} = \${result}\`);`,

    lcm: `// LCM of two numbers
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

// Get user inputs
let num1 = 0; // You can set this via voice with "first number is <value>"
let num2 = 0; // You can set this via voice with "second number is <value>"

// Calculate the result
const result = lcm(num1, num2);

// Display the result
console.log(\`LCM of \${num1} and \${num2} is \${result}\`);`,
  },
  
  python: {
    multiplication: `# Multiplication of two numbers
def multiply(a, b):
    return a * b

# Get user inputs
num1 = 0  # You can set this via voice with "first number is <value>"
num2 = 0  # You can set this via voice with "second number is <value>"

# Calculate the result
result = multiply(num1, num2)

# Display the result
print(f"{num1} × {num2} = {result}")`,

    division: `# Division of two numbers
def divide(a, b):
    if b == 0:
        return "Error: Division by zero is not allowed"
    return a / b

# Get user inputs
num1 = 0  # You can set this via voice with "first number is <value>"
num2 = 1  # You can set this via voice with "second number is <value>"

# Calculate the result
result = divide(num1, num2)

# Display the result
print(f"{num1} ÷ {num2} = {result}")`,

    leapYear: `# Check if a year is a leap year
def is_leap_year(year):
    if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
        return True
    return False

# Get user input
year = 2024  # You can set this via voice with "set year to <value>"

# Check if it's a leap year
result = is_leap_year(year)

# Display the result
if result:
    print(f"{year} is a leap year")
else:
    print(f"{year} is not a leap year")`,
    
    evenOdd: `# Check if a number is even or odd
def check_even_odd(num):
    if num % 2 == 0:
        return "even"
    else:
        return "odd"

# Get user input
number = 0  # You can set this via voice with "set number to <value>"

# Check if it's even or odd
result = check_even_odd(number)

# Display the result
print(f"{number} is {result}")`,

    primeNumber: `# Check if a number is prime
def is_prime(num):
    if num <= 1:
        return False
    if num <= 3:
        return True
        
    if num % 2 == 0 or num % 3 == 0:
        return False
        
    i = 5
    while i * i <= num:
        if num % i == 0 or num % (i + 2) == 0:
            return False
        i += 6
        
    return True

# Get user input
number = 7  # You can set this via voice with "set number to <value>"

# Check if it's a prime number
result = is_prime(number)

# Display the result
if result:
    print(f"{number} is a prime number")
else:
    print(f"{number} is not a prime number")`,
    
    addition: `# Addition of two numbers
def add(a, b):
    return a + b

# Get user inputs
num1 = 0  # You can set this via voice with "first number is <value>"
num2 = 0  # You can set this via voice with "second number is <value>"

# Calculate the result
result = add(num1, num2)

# Display the result
print(f"{num1} + {num2} = {result}")`,

    lcm: `# LCM of two numbers
def gcd(a, b):
    return a if b == 0 else gcd(b, a % b)

def lcm(a, b):
    return abs(a * b) // gcd(a, b)

# Get user inputs
num1 = 0  # You can set this via voice with "first number is <value>"
num2 = 0  # You can set this via voice with "second number is <value>"

# Calculate the result
result = lcm(num1, num2)

# Display the result
print(f"LCM of {num1} and {num2} is {result}")`,
  },
  
  c: {
    multiplication: `#include <stdio.h>

// Multiplication of two numbers
int multiply(int a, int b) {
    return a * b;
}

int main() {
    // Get user inputs
    int num1 = 0; // You can set this via voice with "first number is <value>"
    int num2 = 0; // You can set this via voice with "second number is <value>"
    
    // Calculate the result
    int result = multiply(num1, num2);
    
    // Display the result
    printf("%d × %d = %d\\n", num1, num2, result);
    
    return 0;
}`,

    division: `#include <stdio.h>

// Division of two numbers
float divide(float a, float b) {
    if (b == 0) {
        printf("Error: Division by zero is not allowed\\n");
        return 0;
    }
    return a / b;
}

int main() {
    // Get user inputs
    float num1 = 0; // You can set this via voice with "first number is <value>"
    float num2 = 1; // You can set this via voice with "second number is <value>"
    
    // Calculate the result
    float result = divide(num1, num2);
    
    // Display the result
    printf("%.2f ÷ %.2f = %.2f\\n", num1, num2, result);
    
    return 0;
}`,

    leapYear: `#include <stdio.h>

// Check if a year is a leap year
int isLeapYear(int year) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        return 1;
    }
    return 0;
}

int main() {
    // Get user input
    int year = 2024; // You can set this via voice with "set year to <value>"
    
    // Check if it's a leap year
    int result = isLeapYear(year);
    
    // Display the result
    if (result) {
        printf("%d is a leap year\\n", year);
    } else {
        printf("%d is not a leap year\\n", year);
    }
    
    return 0;
}`,

    evenOdd: `#include <stdio.h>

// Check if a number is even or odd
const char* checkEvenOdd(int num) {
    if (num % 2 == 0) {
        return "even";
    } else {
        return "odd";
    }
}

int main() {
    // Get user input
    int number = 0; // You can set this via voice with "set number to <value>"
    
    // Check if it's even or odd
    const char* result = checkEvenOdd(number);
    
    // Display the result
    printf("%d is %s\\n", number, result);
    
    return 0;
}`,

    primeNumber: `#include <stdio.h>
#include <stdbool.h>

// Check if a number is prime
bool isPrime(int num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    
    if (num % 2 == 0 || num % 3 == 0) return false;
    
    int i = 5;
    while (i * i <= num) {
        if (num % i == 0 || num % (i + 2) == 0) return false;
        i += 6;
    }
    
    return true;
}

int main() {
    // Get user input
    int number = 7; // You can set this via voice with "set number to <value>"
    
    // Check if it's a prime number
    bool result = isPrime(number);
    
    // Display the result
    if (result) {
        printf("%d is a prime number\\n", number);
    } else {
        printf("%d is not a prime number\\n", number);
    }
    
    return 0;
}`,
    
    addition: `#include <stdio.h>

// Addition of two numbers
int add(int a, int b) {
    return a + b;
}

int main() {
    // Get user inputs
    int num1 = 0; // You can set this via voice with "first number is <value>"
    int num2 = 0; // You can set this via voice with "second number is <value>"
    
    // Calculate the result
    int result = add(num1, num2);
    
    // Display the result
    printf("%d + %d = %d\\n", num1, num2, result);
    
    return 0;
}`,

    lcm: `#include <stdio.h>
#include <stdlib.h>

// GCD function
int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

// LCM function
int lcm(int a, int b) {
    return abs(a * b) / gcd(a, b);
}

int main() {
    // Get user inputs
    int num1 = 0; // You can set this via voice with "first number is <value>"
    int num2 = 0; // You can set this via voice with "second number is <value>"
    
    // Calculate the result
    int result = lcm(num1, num2);
    
    // Display the result
    printf("LCM of %d and %d is %d\\n", num1, num2, result);
    
    return 0;
}`,
  },
  
  java: {
    multiplication: `// Multiplication of two numbers
public class Multiplication {
    public static int multiply(int a, int b) {
        return a * b;
    }
    
    public static void main(String[] args) {
        // Get user inputs
        int num1 = 0; // You can set this via voice with "first number is <value>"
        int num2 = 0; // You can set this via voice with "second number is <value>"
        
        // Calculate the result
        int result = multiply(num1, num2);
        
        // Display the result
        System.out.println(num1 + " × " + num2 + " = " + result);
    }
}`,

    division: `// Division of two numbers
public class Division {
    public static double divide(double a, double b) {
        if (b == 0) {
            System.out.println("Error: Division by zero is not allowed");
            return 0;
        }
        return a / b;
    }
    
    public static void main(String[] args) {
        // Get user inputs
        double num1 = 0; // You can set this via voice with "first number is <value>"
        double num2 = 1; // You can set this via voice with "second number is <value>"
        
        // Calculate the result
        double result = divide(num1, num2);
        
        // Display the result
        System.out.println(num1 + " ÷ " + num2 + " = " + result);
    }
}`,

    leapYear: `// Check if a year is a leap year
public class LeapYear {
    public static boolean isLeapYear(int year) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return true;
        }
        return false;
    }
    
    public static void main(String[] args) {
        // Get user input
        int year = 2024; // You can set this via voice with "set year to <value>"
        
        // Check if it's a leap year
        boolean result = isLeapYear(year);
        
        // Display the result
        if (result) {
            System.out.println(year + " is a leap year");
        } else {
            System.out.println(year + " is not a leap year");
        }
    }
}`,

    evenOdd: `// Check if a number is even or odd
public class EvenOdd {
    public static String checkEvenOdd(int num) {
        if (num % 2 == 0) {
            return "even";
        } else {
            return "odd";
        }
    }
    
    public static void main(String[] args) {
        // Get user input
        int number = 0; // You can set this via voice with "set number to <value>"
        
        // Check if it's even or odd
        String result = checkEvenOdd(number);
        
        // Display the result
        System.out.println(number + " is " + result);
    }
}`,

    primeNumber: `// Check if a number is prime
public class PrimeNumber {
    public static boolean isPrime(int num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        
        if (num % 2 == 0 || num % 3 == 0) return false;
        
        int i = 5;
        while (i * i <= num) {
            if (num % i == 0 || num % (i + 2) == 0) return false;
            i += 6;
        }
        
        return true;
    }
    
    public static void main(String[] args) {
        // Get user input
        int number = 7; // You can set this via voice with "set number to <value>"
        
        // Check if it's a prime number
        boolean result = isPrime(number);
        
        // Display the result
        if (result) {
            System.out.println(number + " is a prime number");
        } else {
            System.out.println(number + " is not a prime number");
        }
    }
}`,
    
    addition: `// Addition of two numbers
public class Addition {
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        // Get user inputs
        int num1 = 0; // You can set this via voice with "first number is <value>"
        int num2 = 0; // You can set this via voice with "second number is <value>"
        
        // Calculate the result
        int result = add(num1, num2);
        
        // Display the result
        System.out.println(num1 + " + " + num2 + " = " + result);
    }
}`,

    lcm: `// LCM of two numbers
public class LCM {
    public static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    
    public static int lcm(int a, int b) {
        return Math.abs(a * b) / gcd(a, b);
    }
    
    public static void main(String[] args) {
        // Get user inputs
        int num1 = 0; // You can set this via voice with "first number is <value>"
        int num2 = 0; // You can set this via voice with "second number is <value>"
        
        // Calculate the result
        int result = lcm(num1, num2);
        
        // Display the result
        System.out.println("LCM of " + num1 + " and " + num2 + " is " + result);
    }
}`
  }
};

export const CodingGame = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [language, setLanguage] = useState("javascript");
  const [currentProgram, setCurrentProgram] = useState("");
  const { transcript, isListening, startListening: toggleListening, clearTranscript: resetTranscript } = useVoice();
  const { toast } = useToast();

  // Effect to update code when language changes
  useEffect(() => {
    if (currentProgram && language) {
      setCode(programTemplates[language][currentProgram]);
    }
  }, [language, currentProgram]);

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
