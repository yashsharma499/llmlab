
"use client";

import { useEffect, useState } from "react";
import { Cpu, Layers, Clock, CheckCircle, XCircle, Unlock, Lock, Zap, Search, Filter } from "lucide-react";

interface Architecture {
  name: string;
  model_family: string;
  architecture: string;
  training_objective: string;
  input_output_format: string;
  generation: string;
  best_for: string[];
  bad_for: string[];
  generation_style: string;
  open_source: boolean;
  inference_cost: string;
  context_window: number;
}

export default function ArchitecturesPage() {
  const [data, setData] = useState<Architecture[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/architectures")
      .then((res) => res.json())
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredData = data.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.architecture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.model_family.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterOpen === null || model.open_source === filterOpen;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                LLM Architecture Explorer
              </h1>
            </div>
            <p className="text-lg text-slate-400 max-w-3xl">
              Explore and compare different large language model architectures, their capabilities, and ideal use cases.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search models, architectures, or families..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilterOpen(null)}
                className={`px-5 py-3.5 rounded-xl font-medium transition-all ${
                  filterOpen === null
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-900/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800/50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterOpen(true)}
                className={`px-5 py-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  filterOpen === true
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-slate-900/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800/50"
                }`}
              >
                <Unlock className="w-4 h-4" />
                Open Source
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className={`px-5 py-3.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  filterOpen === false
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-500/30"
                    : "bg-slate-900/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800/50"
                }`}
              >
                <Lock className="w-4 h-4" />
                Closed
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span>{filteredData.length} models found</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>{filteredData.filter(m => m.open_source).length} open source</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span>{filteredData.filter(m => !m.open_source).length} closed source</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 animate-pulse">
                <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Model Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.map((model, index) => (
              <div
                key={model.name}
                className="group bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {model.name}
                      </h2>
                      <p className="text-sm text-slate-500 font-medium">{model.model_family}</p>
                    </div>
                  </div>

                  {model.open_source ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold">
                      <Unlock className="w-3.5 h-3.5" /> Open
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-xs font-semibold">
                      <Lock className="w-3.5 h-3.5" /> Closed
                    </span>
                  )}
                </div>

                {/* Architecture Info */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
                    <Layers className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300 truncate">{model.architecture}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
                    <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300 truncate">{model.context_window.toLocaleString()}</span>
                  </div>
                </div>

                {/* Generation & Cost */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Generation</p>
                    <p className="text-sm text-slate-300">{model.generation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost</p>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <p className="text-sm text-slate-300">{model.inference_cost}</p>
                    </div>
                  </div>
                </div>

                {/* Training Objective */}
                <div className="mb-5 pb-5 border-b border-slate-800/50">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Training Objective</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{model.training_objective}</p>
                </div>

                {/* Best For / Not Ideal For */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Best For</h3>
                    </div>
                    <ul className="space-y-2">
                      {model.best_for.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wide">Not Ideal For</h3>
                    </div>
                    <ul className="space-y-2">
                      {model.bad_for.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
              <Filter className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No models found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}