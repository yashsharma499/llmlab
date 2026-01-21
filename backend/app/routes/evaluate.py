from fastapi import APIRouter
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from nltk.translate.bleu_score import SmoothingFunction
from rouge_score import rouge_scorer

from app.services.evaluation_service import generate_and_evaluate

router = APIRouter()

# Load once
embedder = SentenceTransformer("all-MiniLM-L6-v2")
rouge = rouge_scorer.RougeScorer(["rougeL"], use_stemmer=True)
smooth = SmoothingFunction().method1


class EvalRequest(BaseModel):
    prompt: str
    model: str               # "flan_t5" | "distilgpt2"
    reference: str | None = None


@router.post("/evaluate")
def evaluate(req: EvalRequest):
    result = generate_and_evaluate(
        prompt=req.prompt,
        model=req.model,
        reference=req.reference.strip() if req.reference else None,
        embedder=embedder,
        rouge=rouge,
        smooth=smooth,
    )
    return result
