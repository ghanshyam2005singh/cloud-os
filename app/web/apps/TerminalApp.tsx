"use client";
import { useState, useRef, useEffect } from "react";

export default function TerminalApp() {
  const [lines, setLines] = useState<string[]>(["Welcome to Cloud OS Terminal!"]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

   async function handleCommand(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLines(prev => [...prev, `> ${input}`]);
    // Call backend API
    const res = await fetch("/api/terminal/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: input }),
    });
    const data = await res.json();
    setLines(prev => [...prev, data.output]);
    setInput("");
  }

  return (
    <div className="bg-black rounded-lg p-4 text-green-400 font-mono" style={{ minHeight: 300 }}>
      <h3 className="text-xl font-bold mb-4 text-green-300">Terminal</h3>
      <div className="overflow-y-auto mb-2" style={{ maxHeight: 200 }}>
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex items-center gap-2">
        <span>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="bg-black text-green-400 border-none outline-none flex-1"
          autoFocus
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-3 py-1 rounded"
        >
          Enter
        </button>
      </form>
    </div>
  );
}