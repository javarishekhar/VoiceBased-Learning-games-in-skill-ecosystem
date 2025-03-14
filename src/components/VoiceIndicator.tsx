
import { Mic, MicOff } from "lucide-react";
import { useVoice } from "@/contexts/VoiceContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function VoiceIndicator() {
  const { isListening, confidence } = useVoice();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors duration-200",
          isListening
            ? "bg-secondary"
            : "bg-white hover:bg-gray-100 cursor-pointer"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
      >
        {isListening ? (
          <Mic className="w-6 h-6 text-white" />
        ) : (
          <MicOff className="w-6 h-6 text-gray-600" />
        )}
      </motion.div>
      {isListening && confidence > 0 && (
        <motion.div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-2 bg-gray-200 rounded-full mb-1 overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(confidence * 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-center">
            {Math.round(confidence * 100)}%
          </div>
        </motion.div>
      )}
    </div>
  );
}
