import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { EvaluationResult, MetricScores } from "@/types/evaluation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const METRIC_COLORS: Record<keyof MetricScores, string> = {
  bleu: "rgba(99, 102, 241, 0.7)",
  rouge_l: "rgba(14, 165, 233, 0.7)",
  semantic_similarity: "rgba(16, 185, 129, 0.7)",
  repetition_score: "rgba(244, 63, 94, 0.7)",
};

const METRIC_LABELS: Record<keyof MetricScores, string> = {
  bleu: "BLEU",
  rouge_l: "ROUGE-L",
  semantic_similarity: "Semantic Similarity",
  repetition_score: "Repetition Penalty",
};

export default function EvaluationChart({ data }: { data: EvaluationResult }) {
  const models = Object.keys(data.model_results);

  // ✅ Only include metrics that actually exist
  const availableMetrics = (Object.keys(METRIC_LABELS) as (keyof MetricScores)[])
    .filter((metric) =>
      models.some(
        (model) => data.model_results[model][metric] !== undefined
      )
    );

  const datasets = availableMetrics.map((metric) => ({
    label: METRIC_LABELS[metric],
    data: models.map(
      (model) => data.model_results[model][metric] ?? 0
    ),
    backgroundColor: METRIC_COLORS[metric],
    borderRadius: 6,
  }));

  return (
    <Bar
      data={{ labels: models, datasets }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (ctx: TooltipItem<"bar">) => {
                const raw =
                  typeof ctx.parsed === "number"
                    ? ctx.parsed
                    : ctx.parsed?.y;

                const value = typeof raw === "number" ? raw : 0;
                return `${ctx.dataset.label}: ${value.toFixed(3)}`;
              },
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 1,
            ticks: {
              stepSize: 0.2,
            },
          },
        },
      }}
    />
  );
}
