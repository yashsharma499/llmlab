from fastapi import APIRouter
from pydantic import BaseModel
from app.services.decoder_service import generate_decoder
from app.services.encoder_decoder_service import generate_encoder_decoder

router = APIRouter(prefix="/generate", tags=["Generation"])

class GenerateRequest(BaseModel):
    text: str
    task: str

@router.post("/decoder")
def decoder_generate(req: GenerateRequest):
    return {
        "model": "Decoder-only",
        "output": generate_decoder(req.text)
    }

@router.post("/encoder_decoder")
def encoder_decoder_generate(req: GenerateRequest):
    return {
        "model": "Encoder-Decoder",
        "output": generate_encoder_decoder(req.text, req.task)
    }
