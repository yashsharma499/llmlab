from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.context_service import analyze_context

router = APIRouter(
    prefix="/context",
    tags=["Context Window"]
)

# Allowed models for Module 3 (FINAL)
SUPPORTED_MODELS = ["distilgpt2", "flan-t5-base"]

class ContextRequest(BaseModel):
    text: str
    model_name: str  # distilgpt2 | flan-t5-base


@router.post("/analyze")
def analyze_context_window(req: ContextRequest):
    if req.model_name not in SUPPORTED_MODELS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported model. Choose from {SUPPORTED_MODELS}"
        )

    return analyze_context(
        text=req.text,
        model_name=req.model_name
    )

