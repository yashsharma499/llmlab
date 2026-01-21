"use client";

import { useEffect, useState } from "react";
import ComparisonTable from "@/components/ComparisonTable";
import ComparisonChart from "@/components/ComparisonChart";
import UseCases from "@/components/UseCases";
import { ShieldCheck, Scale, Briefcase } from "lucide-react";

export default function OpenVsClosed() {
  const [data, setData] = useState<any[]>([]);
  const [scale, setScale] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/model-comparison/`)
    .then((res) => res.json())
    .then((d) => {
      setData(d.comparison);
      setScale(d.score_scale);
      setLoading(false);
    });
}, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 space-y-20">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Open-Source vs Closed-Source LLMs
        </h1>
        <p className="max-w-3xl text-slate-400 leading-relaxed">
          Analyze real-world trade-offs between open and closed large language
          models across cost, control, privacy, latency, and enterprise
          suitability.
        </p>
        {!loading && (
          <p className="text-xs text-slate-500">
            Score scale: {scale}
          </p>
        )}
      </section>

      {/* Comparison Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Scale className="w-4 h-4 text-indigo-400" />
          Model Comparison
        </div>

        <div className="glass-card rounded-2xl p-6">
          {loading ? (
            <p className="text-sm text-slate-400">
              Loading comparison data…
            </p>
          ) : (
            <ComparisonTable data={data} />
          )}
        </div>
      </section>

      {/* Comparison Chart */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Strategic Trade-offs
        </div>

        <div className="glass-card rounded-2xl p-6">
          {loading ? (
            <p className="text-sm text-slate-400">
              Rendering chart…
            </p>
          ) : (
            <>
              <ComparisonChart data={data} />
              <p className="mt-3 text-xs text-slate-500 text-center">
                Scale: 1 = worst, 5 = best (higher is better)
              </p>
            </>
          )}
        </div>
      </section>

      {/* Use Cases */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          Real-World Use Cases
        </div>

        <div className="glass-card rounded-2xl p-6">
          <UseCases />
        </div>
      </section>
    </div>
  );
}

