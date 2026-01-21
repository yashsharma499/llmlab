"use client";

import { useState } from "react";
import { Sparkles, ThumbsUp } from "lucide-react";

export default function RLHFPage() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [ranking, setRanking] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setMessage("");

    const res = await fetch("http://localhost:8000/rlhf/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponses(data.responses);
    setRanking([]);
    setLoading(false);
  };

 const submitFeedback = async () => {
  if (ranking.length !== 3) {
    alert("Please rank all responses");
    return;
  }

  await fetch("http://localhost:8000/rlhf/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, responses, ranking }),
  });

  setRanking([]); // reset UI state
  setMessage("Human feedback stored. RLHF bias applied!");
};

const generateBiased = async () => {
  setLoading(true);
  setMessage("");

  const res = await fetch("http://localhost:8000/rlhf/generate_biased", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  setResponses(data.responses);
  setRanking([]); // reset old ranks
  setLoading(false);
};


  return (
    <div className="mx-auto max-w-6xl px-6 py-20 space-y-16">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          RLHF Simulation
        </h1>
        <p className="max-w-2xl text-slate-400">
          Rank model outputs to simulate Reinforcement Learning with Human Feedback.
        </p>
      </section>

      {/* Prompt */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <textarea
          className="w-full min-h-[120px] rounded-lg bg-transparent border border-white/10 p-3 text-sm"
          placeholder="Enter a prompt…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white"
        >
          <Sparkles className="w-4 h-4" />
          Generate 3 Responses
        </button>
      </div>

      {/* Responses */}
      {responses.length === 3 && (
        <div className="space-y-8">
          <h2 className="font-semibold text-slate-300">
            Rank Responses (Best → Worst)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {responses.map((r, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
                <div className="text-sm font-semibold text-slate-400">
                  Response {i + 1}
                </div>

                <div className="bg-black/20 p-3 rounded-lg text-sm whitespace-pre-wrap">
                  {r}
                </div>

                <select
                  onChange={(e) => {
                    const updated = [...ranking];
                    updated[Number(e.target.value)] = i;
                    setRanking(updated);
                  }}
                  className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 text-sm"
                >
                  <option value="">Select rank</option>
                  <option value="0">Best</option>
                  <option value="1">Middle</option>
                  <option value="2">Worst</option>
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={submitFeedback}
              className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white"
            >
              Submit Feedback
            </button>

            <button
              onClick={generateBiased}
              className="rounded-lg bg-indigo-700 px-6 py-2 text-sm font-semibold text-white"
            >
              Generate with RLHF Bias
            </button>
          </div>

          {message && (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ThumbsUp className="w-4 h-4" />
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
