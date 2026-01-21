from transformers import AutoTokenizer, AutoModelForCausalLM
import numpy as np

MODEL_NAME = "distilgpt2"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

tokenizer.pad_token = tokenizer.eos_token
model.eval()


def randomness_score(text: str) -> float:
    """
    Simple randomness proxy:
    unique_tokens / total_tokens
    """
    tokens = text.split()
    if not tokens:
        return 0.0
    return round(len(set(tokens)) / len(tokens), 3)


def run_sampling(prompt: str, temperature: float, top_k: int, top_p: float):
    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = []
    scores = []

    for _ in range(5):
        generated = model.generate(
            **inputs,
            max_new_tokens=80,
            do_sample=True,
            temperature=temperature,
            top_k=top_k,
            top_p=top_p,
            eos_token_id=tokenizer.eos_token_id,
            pad_token_id=tokenizer.eos_token_id
        )

        text = tokenizer.decode(generated[0], skip_special_tokens=True)
        score = randomness_score(text)

        outputs.append({
            "text": text,
            "randomness_score": score
        })
        scores.append(score)

    return {
        "config": {
            "temperature": temperature,
            "top_k": top_k,
            "top_p": top_p
        },
        "outputs": outputs,
        "average_randomness": round(float(np.mean(scores)), 3)
    }
