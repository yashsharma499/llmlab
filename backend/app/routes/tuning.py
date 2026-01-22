from fastapi import APIRouter
from pydantic import BaseModel
from app.services.prompt_tuning import run_prompt_tuning

from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model
import torch

router = APIRouter(prefix="/tuning", tags=["Tuning"])



class PromptRequest(BaseModel):
    text: str
    mode: str


class LoraRequest(BaseModel):
    prompt: str


@router.get("/prompt/templates")
def get_prompt_templates():
    return {
        "method": "Prompt Tuning",
        "templates": [
            {
                "mode": "summarize",
                "template": "Summarize the following text:\n{text}"
            },
            {
                "mode": "translate",
                "template": "Translate the following text to French:\n{text}"
            },
            {
                "mode": "qa",
                "template": "Answer the question based on the context:\nContext: {text}"
            }
        ]
    }


@router.post("/prompt")
def prompt_tuning(req: PromptRequest):
    output = run_prompt_tuning(req.text, req.mode)
    return {
        "method": "Prompt Tuning",
        "mode": req.mode,
        "weights_updated": False,
        "output": output
    }

@router.get("/finetune/explain")
def finetune_explain():
    return {
        "method": "Fine-Tuning",
        "weights_updated": "All model parameters",
        "data_required": "10k–100k labeled samples",
        "compute": "GPU required",
        "cost": "Very High",
        "risks": [
            "Overfitting",
            "Catastrophic forgetting",
            "Long training time"
        ],
        "recommended_when": "Highly domain-specific tasks",
        "note": "Not demonstrated due to cost and complexity"
    }



@router.get("/lora/explain")
def lora_explain():
    return {
        "method": "LoRA",
        "weights_updated": "Low-rank adapter layers only",
        "base_model_frozen": True,
        "trainable_parameters": "< 1%",
        "cost": "Low",
        "speed": "Fast",
        "why_it_works": "Injects task-specific knowledge without modifying base model",
        "recommended_when": "Efficient domain adaptation"
    }



@router.post("/lora/demo")
def lora_demo(req: LoraRequest):
    """
    This is a SMALL-SCALE DEMO.
    - No training loop
    - Shows how LoRA adapters are attached
    """

    model_name = "distilgpt2"

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)

    lora_config = LoraConfig(
        r=4,
        lora_alpha=16,
        target_modules=["c_attn"],
        lora_dropout=0.1,
        bias="none",
        task_type="CAUSAL_LM"
    )

    lora_model = get_peft_model(model, lora_config)

    inputs = tokenizer(req.prompt, return_tensors="pt")
    outputs = lora_model.generate(
        **inputs,
        max_length=50,
        do_sample=True
    )

    generated = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {
        "method": "LoRA Demo",
        "base_model": model_name,
        "trainable_parameters_percent": "<1%",
        "note": "Adapter attached, no full fine-tuning performed",
        "output": generated
    }


@router.get("/compare")
def tuning_comparison():
    return [
        {
            "method": "Prompt Tuning",
            "weights_updated": "None",
            "cost": "Very Low",
            "speed": "Instant",
            "data_needed": "None",
            "best_for": "Quick task adaptation"
        },
        {
            "method": "Fine-Tuning",
            "weights_updated": "All parameters",
            "cost": "Very High",
            "speed": "Slow",
            "data_needed": "Large dataset",
            "best_for": "Highly specialized domains"
        },
        {
            "method": "LoRA",
            "weights_updated": "Adapter layers only",
            "cost": "Low",
            "speed": "Fast",
            "data_needed": "Small dataset",
            "best_for": "Cost-efficient domain adaptation"
        }
    ]
