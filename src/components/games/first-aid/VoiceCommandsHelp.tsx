
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface VoiceCommandsHelpProps {
  showVoiceHelp: boolean;
  setShowVoiceHelp: (show: boolean) => void;
}

export function VoiceCommandsHelp({ showVoiceHelp, setShowVoiceHelp }: VoiceCommandsHelpProps) {
  if (!showVoiceHelp) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={() => setShowVoiceHelp(false)}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 text-center">Voice Commands</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="font-bold text-primary">"Check the scene"</p>
            <p className="text-sm">Complete the current step</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="font-bold text-primary">"Next step"</p>
            <p className="text-sm">Move to the next step</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="font-bold text-primary">"What equipment do I need?"</p>
            <p className="text-sm">Get required equipment list</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="font-bold text-primary">"Explain details"</p>
            <p className="text-sm">Get step explanation</p>
          </div>
        </div>
        <Button 
          className="w-full mt-4" 
          onClick={() => setShowVoiceHelp(false)}
        >
          Close
        </Button>
      </div>
    </motion.div>
  );
}
