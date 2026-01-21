
"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  Layers, 
  ChevronDown, 
  Cpu, 
  Hash, 
  ZapOff, 
  CheckCircle2, 
  Terminal,
  ArrowRight
} from "lucide-react";

export default function ContextPage() {
  const [text, setText] = useState("");
  const [model, setModel] = useState("distilgpt2");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/context/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_name: model
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-12">
        
        {/* Header Section */}
        <header className="space-y-4 border-l-2 border-indigo-500 pl-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium tracking-wider uppercase">
            <Terminal className="w-3.h-3" />
            LLM Diagnostics
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Context Analyzer
          </h1>
          <p className="max-w-2xl text-lg text-slate-400 leading-relaxed">
            Quantify context window limitations across different transformer architectures 
            to understand how models truncate your data.
          </p>
        </header>

        {/* Input Area */}
        <div className="group relative rounded-2xl bg-slate-900/50 border border-slate-800 p-1 focus-within:border-indigo-500/50 transition-all duration-300 shadow-2xl">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-400" />
                Input Document
              </label>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                {text.length} Characters
              </span>
            </div>
            
            <textarea
              className="w-full min-h-[200px] bg-transparent border-none p-0 text-slate-200 placeholder:text-slate-600 focus:ring-0 text-base resize-none"
              placeholder="Paste long-form text or documentation here to test window limits..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="relative group/select">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full sm:w-64 appearance-none rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
                >
                  <option value="distilgpt2">DistilGPT-2 (Decoder-only)</option>
                  <option value="flan-t5-base">FLAN-T5 Base (Enc-Dec)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-500 group-hover/select:text-indigo-400 transition-colors pointer-events-none" />
              </div>

              <button
                onClick={analyze}
                disabled={loading || !text.trim()}
                className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    Analyze Context
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Model" value={result.model} icon={<Cpu className="w-4 h-4 text-indigo-400" />} />
              <StatCard label="Limit" value={result.context_limit} icon={<Layers className="w-4 h-4 text-emerald-400" />} />
              <StatCard label="Input" value={result.input_tokens} icon={<Hash className="w-4 h-4 text-sky-400" />} />
              <StatCard 
                label="Dropped" 
                value={result.dropped_tokens} 
                icon={<ZapOff className="w-4 h-4 text-rose-400" />} 
                highlight={result.lost_context}
              />
            </div>

            {/* Alert Banner */}
            {result.lost_context && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                  <strong>Token Overflow Detected:</strong> The input exceeds this model's attention window. Information in the "Dropped" section was ignored during processing.
                </p>
              </div>
            )}

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" />
                  Kept Context
                </div>
                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="max-h-[300px] overflow-auto p-5 text-sm leading-relaxed text-slate-300 font-mono scrollbar-thin scrollbar-thumb-slate-700">
                    {result.kept_text}
                  </div>
                </div>
              </div>

              {result.lost_context && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-widest">
                    <ZapOff className="w-4 h-4" />
                    Dropped Context
                  </div>
                  <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                    <div className="max-h-[300px] overflow-auto p-5 text-sm leading-relaxed text-slate-400 font-mono line-through decoration-rose-500/30 scrollbar-thin scrollbar-thumb-slate-700">
                      {result.dropped_text}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false }: { label: string, value: any, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 transition-all ${highlight ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-800 bg-slate-900/40'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      </div>
      <div className={`text-xl font-bold ${highlight ? 'text-rose-400' : 'text-white'}`}>
        {value?.toLocaleString() || value}
      </div>
    </div>
  );
}