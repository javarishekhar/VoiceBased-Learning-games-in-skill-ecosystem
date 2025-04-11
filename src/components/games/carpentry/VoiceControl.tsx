
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface VoiceControlProps {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
}

export function VoiceControl({ 
  isListening, 
  startListening, 
  stopListening, 
  transcript 
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
    </>
  );
}
