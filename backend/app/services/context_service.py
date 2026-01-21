from transformers import AutoTokenizer

MODEL_CONFIG = {
    "distilgpt2": {
        "type": "decoder-only",
        "tokenizer": "distilgpt2",
        "context_limit": 1024
    },
    "flan-t5-base": {
        "type": "encoder-decoder",
        "tokenizer": "google/flan-t5-base",
        "context_limit": 512
    }
}

TOKENIZERS = {
    model: AutoTokenizer.from_pretrained(cfg["tokenizer"])
    for model, cfg in MODEL_CONFIG.items()
}

def analyze_context(text: str, model_name: str):
    config = MODEL_CONFIG[model_name]
    tokenizer = TOKENIZERS[model_name]

    tokens = tokenizer.encode(text)
    total_tokens = len(tokens)
    limit = config["context_limit"]

    if total_tokens <= limit:
        return {
            "model": model_name,
            "model_type": config["type"],
            "context_limit": limit,
            "input_tokens": total_tokens,
            "used_tokens": total_tokens,
            "dropped_tokens": 0,
            "kept_text": text,
            "dropped_text": "",
            "lost_context": False,
            "strategy": "none"
        }

    kept_tokens = tokens[:limit]
    dropped_tokens = tokens[limit:]

    return {
        "model": model_name,
        "model_type": config["type"],
        "context_limit": limit,
        "input_tokens": total_tokens,
        "used_tokens": len(kept_tokens),
        "dropped_tokens": len(dropped_tokens),
        "kept_text": tokenizer.decode(kept_tokens),
        "dropped_text": tokenizer.decode(dropped_tokens),
        "lost_context": True,
        "strategy": "head_truncation"
    }
