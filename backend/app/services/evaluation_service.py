import re
from sklearn.metrics.pairwise import cosine_similarity
from nltk.translate.bleu_score import sentence_bleu
from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    AutoModelForCausalLM,
)

# Load models once
flan_tok = AutoTokenizer.from_pretrained("google/flan-t5-small")
flan_mod = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")

gpt_tok = AutoTokenizer.from_pretrained("distilgpt2")
gpt_mod = AutoModelForCausalLM.from_pretrained("distilgpt2")


def repetition_score(text: str) -> float:
    tokens = re.findall(r"\w+", text.lower())
    if not tokens:
        return 0.0
    return float(1 - (len(set(tokens)) / len(tokens)))


def generate_text(prompt: str, model: str) -> str:
    if model == "flan_t5":
        inputs = flan_tok(prompt, return_tensors="pt")
        outputs = flan_mod.generate(**inputs, max_length=128)
        return flan_tok.decode(outputs[0], skip_special_tokens=True)

    if model == "distilgpt2":
        inputs = gpt_tok(prompt, return_tensors="pt")
        outputs = gpt_mod.generate(
            **inputs,
            max_length=128,
            do_sample=True
        )
        return gpt_tok.decode(outputs[0], skip_special_tokens=True)

    raise ValueError("Unknown model")


def generate_and_evaluate(prompt, model, reference, embedder, rouge, smooth):
    output = generate_text(prompt, model)

    hyp_emb = embedder.encode(output)

    scores = {
        "semantic_similarity": float(1.0),
        "repetition_score": float(repetition_score(output)),
    }

    if reference:
        ref_emb = embedder.encode(reference)

        scores["semantic_similarity"] = float(
            cosine_similarity([ref_emb], [hyp_emb])[0][0]
        )

        scores["bleu"] = float(
            sentence_bleu(
                [reference.split()],
                output.split(),
                smoothing_function=smooth,
            )
        )

        scores["rouge_l"] = float(
            rouge.score(reference, output)["rougeL"].fmeasure
        )

    return {
        "prompt": prompt,
        "reference": reference,
        "generated_output": output,
        "model_results": {
            model: {
                k: float(v) for k, v in scores.items()
            }
        },
    }
