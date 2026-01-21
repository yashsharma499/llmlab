"use client";

import { useState } from "react";
import { Sliders, Wand2, Cpu, Layers } from "lucide-react";

type Method = "prompt" | "finetune" | "lora";

export default function TuningPage() {
  const [method, setMethod] = useState<Method>("prompt");
  const [mode, setMode] = useState("summarize");
  const [text, setText] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setOutput(null);

    let res;

    if (method === "prompt") {
      res = await fetch("http://127.0.0.1:8000/tuning/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });

    } else if (method === "lora") {
      res = await fetch("http://127.0.0.1:8000/tuning/lora/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

    } else {
      res = await fetch("http://127.0.0.1:8000/tuning/finetune/explain");
    }

    setOutput(await res.json());
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 space-y-20">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Tuning Lab: Prompt vs LoRA vs Fine-Tuning
        </h1>
        <p className="max-w-3xl text-slate-400 leading-relaxed">
          Explore how different tuning strategies affect model behavior,
          cost, speed, and controllability.
        </p>
      </section>

      {/* Method Selector */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setMethod("prompt")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition
              ${
                method === "prompt"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
          >
            <Wand2 className="w-4 h-4" />
            Prompt Tuning
          </button>

          <button
            onClick={() => setMethod("lora")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition
              ${
                method === "lora"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
          >
            <Layers className="w-4 h-4" />
            LoRA
          </button>

          <button
            onClick={() => setMethod("finetune")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition
              ${
                method === "finetune"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
          >
            <Cpu className="w-4 h-4" />
            Fine-Tuning
          </button>
        </div>

        {/* Prompt-Tuning Controls */}
        {method === "prompt" && (
          <div className="space-y-4">
            <select
              className="w-full rounded-lg bg-transparent border border-white/10 p-2 text-sm text-slate-200"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="summarize">Summarize</option>
              <option value="translate">Translate</option>
              <option value="qa">Q&A</option>
            </select>

            <textarea
              className="w-full min-h-[140px] rounded-lg bg-transparent border border-white/10 p-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter input text…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        )}

        {/* LoRA Input */}
        {method === "lora" && (
          <textarea
            className="w-full min-h-[120px] rounded-lg bg-transparent border border-white/10 p-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter prompt for LoRA demo…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        <button
          onClick={run}
          disabled={loading || (!text && method !== "finetune")}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          <Sliders className="w-4 h-4" />
          {loading ? "Running…" : "Run Experiment"}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h3 className="font-semibold text-indigo-400">
            Output
          </h3>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      )}

      {/* Comparison Table */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-indigo-400">
          Method Comparison
        </h3>

        <table className="w-full text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2 text-left">Method</th>
              <th className="py-2 text-left">Cost</th>
              <th className="py-2 text-left">Speed</th>
              <th className="py-2 text-left">Control</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            <tr className="border-t border-white/10">
              <td className="py-2 font-semibold">Prompt Tuning</td>
              <td className="py-2">Very Low</td>
              <td className="py-2">Fast</td>
              <td className="py-2">Medium</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="py-2 font-semibold">LoRA</td>
              <td className="py-2">Low</td>
              <td className="py-2">Fast</td>
              <td className="py-2">High</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="py-2 font-semibold">Fine-Tuning</td>
              <td className="py-2">Very High</td>
              <td className="py-2">Slow</td>
              <td className="py-2">Very High</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
