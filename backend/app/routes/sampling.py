from fastapi import APIRouter
from pydantic import BaseModel
from app.services.sampling_service import run_sampling

router = APIRouter(
    prefix="/sampling",
    tags=["Sampling Parameters"]
)

class SamplingRequest(BaseModel):
    prompt: str
    temperature: float
    top_k: int
    top_p: float


@router.post("/run")
def run_sampling_lab(req: SamplingRequest):
    return run_sampling(
        prompt=req.prompt,
        temperature=req.temperature,
        top_k=req.top_k,
        top_p=req.top_p
    )

