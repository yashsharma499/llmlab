"use client";

import { useState } from "react";
import EvaluationChart from "@/components/EvaluationChart";
import { EvaluationResult } from "@/types/evaluation";
import { BarChart3, PlayCircle } from "lucide-react";

export default function EvaluatePage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flan_t5");
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model, reference }),
    });
    const data = await res.json();
    setGenerated(data.generated_output);
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 space-y-14">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold">LLM Evaluation Metrics</h1>
      </section>

      {/* Inputs */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <textarea
          placeholder="Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-lg bg-black/40 p-3 text-sm"
        />

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full rounded-lg bg-black/40 p-3 text-sm"
        >
          <option value="flan_t5">FLAN-T5</option>
          <option value="distilgpt2">DistilGPT2</option>
        </select>

        <textarea
          placeholder="Reference (optional – used for BLEU / ROUGE)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full rounded-lg bg-black/40 p-3 text-sm"
        />
      </div>

      {/* Action */}
      <div className="glass-card rounded-2xl p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          Generate & Evaluate
        </div>
        <button
          onClick={run}
          disabled={loading || !prompt}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm text-white disabled:opacity-50"
        >
          <PlayCircle className="w-4 h-4" />
          {loading ? "Running…" : "Run"}
        </button>
      </div>

      {/* Generated Output */}
      {generated && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-2">Generated Output</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {generated}
          </p>
        </div>
      )}

      {/* Chart */}
      {result && (
        <div className="glass-card rounded-2xl p-6">
          <EvaluationChart data={result} />
        </div>
      )}

      {/* Metric Explanation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-2">
          <h3 className="font-semibold text-indigo-400">BLEU</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Measures exact n-gram overlap between the generated output and
            a reference answer. Works best for translation-like tasks.
          </p>
          <p className="text-xs text-slate-500">Requires reference answer</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <h3 className="font-semibold text-indigo-400">ROUGE-L</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Uses longest common subsequence to measure structural similarity.
            Commonly used in summarization.
          </p>
          <p className="text-xs text-slate-500">Requires reference answer</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <h3 className="font-semibold text-indigo-400">Semantic Similarity</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Compares meaning using embeddings, even when wording is different.
            More reliable for open-ended generation.
          </p>
          <p className="text-xs text-slate-500">Reference optional</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-2">
          <h3 className="font-semibold text-indigo-400">Repetition Score</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Penalizes repeated words or phrases. High repetition usually
            indicates low-quality or unstable output.
          </p>
          <p className="text-xs text-slate-500">Reference not required</p>
        </div>
      </div>
    </div>
  );
}

