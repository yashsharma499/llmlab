export interface MetricScores {
  bleu?: number;
  rouge_l?: number;
  semantic_similarity: number;
  repetition_score: number;
}

export interface EvaluationResult {
  prompt: string;
  reference?: string | null;
  generated_output: string;
  model_results: {
    [modelName: string]: MetricScores;
  };
}