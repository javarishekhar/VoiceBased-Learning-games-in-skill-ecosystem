
import { useToast } from "@/hooks/use-toast";
import { programTemplates } from "../programTemplates";

export const useProgramHandlers = (language: string, setCode: (code: string) => void) => {
  const { toast } = useToast();

  const handleProgramCommand = (programKey: string) => {
    if (programTemplates[language] && programTemplates[language][programKey]) {
      setCode(programTemplates[language][programKey]);
      toast({
        title: "Program Created",
        description: `Created ${programKey} program`,
      });
      return true;
    }
    return false;
  };

  return {
    handleProgramCommand,
  };
};

