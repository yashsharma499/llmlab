from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rlhf_service import (
    generate_candidates,
    generate_with_rlhf,
    submit_feedback
)

router = APIRouter(
    prefix="/rlhf",
    tags=["RLHF Simulation"]
)


# -------- Schemas --------

class GenerateRequest(BaseModel):
    prompt: str


class FeedbackRequest(BaseModel):
    prompt: str
    responses: list[str]     # 3 generated responses
    ranking: list[int]       # best → worst (e.g. [2,0,1])


# -------- Routes --------

@router.post("/generate")
def generate_initial(req: GenerateRequest):
    """
    Generate 3 candidate responses (no RLHF bias)
    """
    return {
        "responses": generate_candidates(req.prompt)
    }


@router.post("/generate_biased")
def generate_biased(req: GenerateRequest):
    """
    Generate 3 responses influenced by past feedback
    """
    return {
        "responses": generate_with_rlhf(req.prompt)
    }


@router.post("/feedback")
def record_feedback(req: FeedbackRequest):
    """
    Store human preference and compute reward
    """
    return submit_feedback(
        prompt=req.prompt,
        responses=req.responses,
        ranking=req.ranking
    )
