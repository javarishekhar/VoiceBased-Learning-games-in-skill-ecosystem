
import { useToast } from "@/hooks/use-toast";

export const useVariableHandlers = (code: string, setCode: (code: string) => void) => {
  const { toast } = useToast();

  const createVariable = (varName: string, varValue: string) => {
    const newCode = `${code}const ${varName} = ${varValue};\n`;
    setCode(newCode);
    toast({
      title: "Variable Created",
      description: `Created variable "${varName}" with value "${varValue}"`,
    });
  };

  const createFunction = (funcName: string) => {
    const newCode = `${code}function ${funcName}() {\n  // Function body\n}\n`;
    setCode(newCode);
    toast({
      title: "Function Created",
      description: `Created function "${funcName}"`,
    });
  };

  const addPrint = (printValue: string) => {
    const newCode = `${code}console.log(${printValue});\n`;
    setCode(newCode);
    toast({
      title: "Print Statement Added",
      description: `Added console.log for "${printValue}"`,
    });
  };

  return {
    createVariable,
    createFunction,
    addPrint,
  };
};

