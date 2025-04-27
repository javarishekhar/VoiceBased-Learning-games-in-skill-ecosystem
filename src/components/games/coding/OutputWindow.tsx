
import React from "react";
import { outputStyles } from "./styles";

interface OutputWindowProps {
  output: string;
}

export const OutputWindow: React.FC<OutputWindowProps> = ({ output }) => {
  return (
    <div style={outputStyles}>
      <pre>{output}</pre>
    </div>
  );
};
