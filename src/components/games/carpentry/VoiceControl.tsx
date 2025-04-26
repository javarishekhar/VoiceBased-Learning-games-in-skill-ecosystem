
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface VoiceControlProps {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  error?: string;
}

export function VoiceControl({ 
  isListening, 
  startListening, 
  stopListening, 
  transcript,
  error
}: VoiceControlProps) {
  return (
    <>
      <Button
        onClick={() => (isListening ? stopListening() : startListening())}
        className={isListening ? "bg-secondary" : "bg-primary"}
      >
        {isListening ? "Stop Listening" : "Start Speaking"}
      </Button>

      {isListening && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-sm text-gray-600"
        >
          Listening... Say a command!
        </motion.p>
      )}
      
      {transcript && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-2 text-sm text-gray-600"
        >
          Heard: {transcript}
        </motion.p>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </motion.div>
      )}
    </>
  );
}
