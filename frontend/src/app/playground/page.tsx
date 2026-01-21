"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Cpu,
  ArrowRightLeft,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

const TASKS = [
  { value: "summarize", label: "Summarize" },
  { value: "translate to French", label: "Translate → French" },
  { value: "answer the question", label: "Answer Question" },
];

function wordCount(text: string) {
  return text ? text.trim().split(/\s+/).length : 0;
}

function repetitionScore(text: string) {
  if (!text) return 0;
  const words = text.toLowerCase().split(/\s+/);
  const freq: Record<string, number> = {};
  words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
  const repeated = Object.values(freq).filter((v) => v > 1).length;
  return repeated / words.length;
}

export default function Playground() {
  const [text, setText] = useState("");
  const [task, setTask] = useState("summarize");
  const [decoderOut, setDecoderOut] = useState("");
  const [encoderOut, setEncoderOut] = useState("");
  const [loading, setLoading] = useState(false);

  const runModels = async () => {
  if (!text.trim()) return;

  setLoading(true);

  try {
    // ✅ Decoder (send BOTH text + task to satisfy schema)
    const d = await fetch("http://127.0.0.1:8000/generate/decoder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        task: task, // required by schema even if unused
      }),
    }).then((r) => r.json());

    // ✅ Encoder-Decoder
    const e = await fetch("http://127.0.0.1:8000/generate/encoder_decoder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        task: task,
      }),
    }).then((r) => r.json());

    setDecoderOut(d.output);
    setEncoderOut(e.output);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 space-y-14">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Decoder vs Encoder-Decoder Playground
        </h1>
        <p className="max-w-3xl text-slate-400">
          Run the same input through two different LLM architectures and
          understand <b>why</b> their outputs differ.
        </p>
      </header>

      {/* Input */}
      <section className="glass-card rounded-2xl p-6 space-y-5">
        <textarea
          className="w-full min-h-[160px] rounded-xl bg-black/30 border border-white/10 p-4 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Paste or type your input text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Task Selector */}
        <div className="flex flex-wrap gap-3">
          {TASKS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTask(t.value)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${
                  task === t.value
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "border-white/15 text-slate-300 hover:bg-white/5"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={runModels}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {loading ? "Running Models..." : "Run Comparison"}
        </button>
      </section>

      {/* Outputs */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Decoder */}
        <motion.div className="glass-card rounded-2xl p-6 flex flex-col space-y-4 h-full">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-semibold">Decoder-Only Model</h2>
          </div>

          {/* Scrollable Output */}
          <div className="flex-1 rounded-xl bg-black/30 border border-white/5 p-4 text-sm text-slate-300 whitespace-pre-wrap overflow-y-auto">
            {decoderOut || "Waiting for input..."}
          </div>

          {decoderOut && (
            <ul className="text-xs text-slate-400 space-y-1 pt-1">
              <li>• Word count: {wordCount(decoderOut)}</li>
              <li>• Autoregressive generation</li>
              {repetitionScore(decoderOut) > 0.25 && (
                <li className="text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Repetition detected
                </li>
              )}
            </ul>
          )}
        </motion.div>

        {/* Encoder-Decoder */}
        <motion.div className="glass-card rounded-2xl p-6 flex flex-col space-y-4 h-full">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">Encoder-Decoder Model</h2>
          </div>

          {/* Scrollable Output */}
          <div className="flex-1 rounded-xl bg-black/30 border border-white/5 p-4 text-sm text-slate-300 whitespace-pre-wrap overflow-y-auto">
            {encoderOut || "Waiting for input..."}
          </div>

          {encoderOut && (
            <ul className="text-xs text-slate-400 space-y-1 pt-1">
              <li>• Word count: {wordCount(encoderOut)}</li>
              <li>• Task-conditioned generation</li>
              <li className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Full input encoded first
              </li>
            </ul>
          )}
        </motion.div>
      </section>
    </div>
  );
}
