"use client";

import { useState } from "react";
import {
  Sliders,
  Sparkles,
  Info,
  Dna,
  MessageSquare,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface SamplingOutput {
  text: string;
  randomness_score: number;
}

interface SamplingResult {
  average_randomness: number;
  outputs: SamplingOutput[];
}

export default function SamplingPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(40);
  const [topP, setTopP] = useState<number>(0.9);
  const [result, setResult] = useState<SamplingResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runSampling = async () => {
  if (!prompt.trim()) return;

  setLoading(true);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sampling/run`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          temperature,
          top_k: topK,
          top_p: topP,
        }),
      }
    );

    const data: SamplingResult = await res.json();
    setResult(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-10">
        {/* Header */}
        <header className="space-y-3 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-widest uppercase">
            <Dna className="w-4 h-4" />
            Inference Laboratory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Sampling Parameters
          </h1>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base">
            Fine-tune token selection logic to balance creativity and determinism.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-8 lg:sticky lg:top-6">
              <div className="flex items-center gap-2 font-semibold text-slate-200 border-b border-slate-800 pb-4">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Configuration
              </div>

              {/* Temperature */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    Temperature
                    <Info className="w-3 h-3 text-slate-400" />
                  </label>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-sm border border-indigo-500/20">
                    {temperature.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.5}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg accent-indigo-500"
                />
              </div>

              {/* Top-K */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Top-K
                  </label>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-sm border border-sky-500/20">
                    {topK}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg accent-sky-500"
                />
              </div>

              {/* Top-P */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Top-P
                  </label>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-sm border border-emerald-500/20">
                    {topP.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={topP}
                  onChange={(e) => setTopP(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-500"
                />
              </div>

              <button
                onClick={runSampling}
                disabled={loading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {loading ? "Simulating..." : "Generate Samples"}
              </button>
            </div>
          </aside>

          {/* Input & Output */}
          <main className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2">
                <MessageSquare className="w-3 h-3" />
                Prompt
              </div>
              <textarea
                className="w-full min-h-[140px] bg-transparent border-none text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none"
                placeholder="Ask a question or provide a sentence starter..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {result && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-medium text-slate-300">
                      Aggregate Randomness
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">
                    {result.average_randomness}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.outputs.map((o, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3"
                    >
                      <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                        <span className="text-[10px] font-black uppercase text-slate-500">
                          Variant {i + 1}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-indigo-400">
                          SCORE: {o.randomness_score}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 italic">
                        “{o.text}”
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
