
import React from "react";
import { editorStyles } from "./styles";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => onChange(e.target.value)}
      style={editorStyles}
      spellCheck="false"
    />
  );
};
