from fastapi import APIRouter

router = APIRouter(prefix="/model-comparison", tags=["Model Comparison"])

@router.get("/")
def get_model_comparison():
    return {
        "score_scale": "1 (worst) to 5 (best)",
        "comparison": [
            {
                "model_type": "Open Source",
                "examples": ["LLaMA", "Mistral", "FLAN-T5"],
                "cost": 4,              
                "latency": 3,           
                "privacy": 5,           
                "control": 5,           
                "customization": 5,     
                "deployment": "Self-hosted",
                "limitations": "Requires infrastructure, MLOps, and ML expertise"
            },
            {
                "model_type": "Closed Source",
                "examples": ["GPT", "Claude", "Gemini"],
                "cost": 2,              
                "latency": 5,           
                "privacy": 2,           
                "control": 2,           
                "customization": 2,     
                "deployment": "API only",
                "limitations": "Vendor lock-in, recurring cost, limited transparency"
            }
        ]
    }
