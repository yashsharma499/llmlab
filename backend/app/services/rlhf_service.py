from transformers import AutoTokenizer, AutoModelForCausalLM
from app.database.rlhf_db import get_db
import json

MODEL_NAME = "distilgpt2"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

tokenizer.pad_token = tokenizer.eos_token
model.eval()


def generate_candidates(prompt: str):
    framed_prompt = (
        "Question:\n"
        f"{prompt}\n\n"
        "Answer in simple words:\n"
    )

    inputs = tokenizer(framed_prompt, return_tensors="pt")

    outputs = model.generate(
        **inputs,
        max_new_tokens=120,
        do_sample=True,
        temperature=0.8,
        top_p=0.9,
        repetition_penalty=1.1,
        num_return_sequences=3,
        pad_token_id=tokenizer.eos_token_id
    )

    responses = []
    for o in outputs:
        decoded = tokenizer.decode(o, skip_special_tokens=True)
        answer = decoded[len(framed_prompt):].strip()
        responses.append(answer or "⚠️ Empty response")

    return responses


def submit_feedback(prompt: str, responses: list[str], ranking: list[int]):
    """
    ranking: [best, mid, worst] → indices of responses
    """
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO rlhf_feedback
        (prompt, response_1, response_2, response_3, ranking)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            prompt,
            responses[0],
            responses[1],
            responses[2],
            json.dumps(ranking)
        )
    )

    conn.commit()
    conn.close()

    rewards = {
        ranking[0]: 1.0,
        ranking[1]: 0.5,
        ranking[2]: 0.0
    }

    return {
        "status": "feedback recorded",
        "rewards": rewards
    }


def apply_rlhf_bias(prompt: str):
    """
    Bias prompt using the most recent preferred response
    """
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT response_1, response_2, response_3, ranking
        FROM rlhf_feedback
        ORDER BY id DESC
        LIMIT 1
        """
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        return prompt

    r1, r2, r3, ranking_json = row
    ranking = json.loads(ranking_json)

    responses = [r1, r2, r3]
    best_response = responses[ranking[0]]

    return (
        prompt
        + "\n\nPreferred answer style (from human feedback):\n"
        + best_response
    )


def generate_with_rlhf(prompt: str):
    biased_prompt = apply_rlhf_bias(prompt)
    return generate_candidates(biased_prompt)
