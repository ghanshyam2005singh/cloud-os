"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function EditorApp() {
  const [value, setValue] = useState("// Start coding!\n");

  function handleEditorChange(newValue: string | undefined) {
    setValue(newValue || "");
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Editor</h3>
      <div className="border rounded-lg overflow-hidden" style={{ height: 400 }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={value}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      </div>
      {/* Add Save/Open buttons and file logic later */}
    </div>
  );
}