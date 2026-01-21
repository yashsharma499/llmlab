"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Beaker,
  BookOpen,
  Layers,
  Zap,
  ArrowRight,
  Binary,
  ShieldCheck,
  Settings2,
  BarChart3,
} from "lucide-react";

const modules = [
  {
    id: 1,
    title: "Architecture Explorer",
    description:
      "Compare GPT, Claude, and LLaMA. Deep dive into Transformer blocks and Decoder-only structures.",
    href: "/architectures",
    icon: <Layers className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Model Playground",
    description:
      "Run prompts side-by-side on Decoder-only vs Encoder-Decoder models.",
    href: "/playground",
    icon: <Zap className="w-5 h-5" />,
    color: "from-amber-400 to-orange-500",
  },
  {
    id: 3,
    title: "Context & Attention",
    description:
      "Stress test token limits and visualize attention behavior.",
    href: "/context",
    icon: <Binary className="w-5 h-5" />,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: 4,
    title: "Sampling Parameters",
    description:
      "Control creativity using Temperature, Top-K, and Top-P.",
    href: "/sampling",
    icon: <Beaker className="w-5 h-5" />,
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: 5,
    title: "RLHF Simulation",
    description: "Simulate how human feedback shapes alignment.",
    href: "/rlhf",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 6,
    title: "Evaluation Metrics",
    description:
      "Evaluate outputs using BLEU, ROUGE-L, and similarity.",
    href: "/evaluate",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    id: 7,
    title: "Open vs Closed Source",
    description:
      "Analyze cost, latency, privacy, and control tradeoffs.",
    href: "/open-vs-closed",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: 8,
    title: "Fine-Tuning & LoRA",
    description:
      "Understand PEFT, LoRA, and prompt-tuning strategies.",
    href: "/tuning",
    icon: <Settings2 className="w-5 h-5" />,
    color: "from-orange-500 to-red-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function HomePage() {
  return (
    <>
      <style jsx global>{`
        header {
          display: none;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
        {/* Hero */}
        <section className="text-center space-y-5 px-2">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight"
          >
            Unpacking the <br />
            <span className="text-gradient">Intelligence Engine</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed"
          >
            Learn how Large Language Models work beyond APIs — architecture,
            inference, and alignment.
          </motion.p>
        </section>

        {/* Modules */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {modules.map((m) => (
            <motion.div key={m.id} variants={item}>
              <Link
                href={m.href}
                className="glass-card group flex h-full flex-col justify-between rounded-xl p-4 sm:p-5 transition-transform hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div
                    className={`w-fit rounded-lg bg-gradient-to-br ${m.color} p-2`}
                  >
                    {m.icon}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-semibold text-white">
                      {m.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-indigo-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  Enter Lab <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </>
  );
}
