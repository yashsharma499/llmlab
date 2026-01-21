from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = None
model = None

PROMPTS = {
    "summarize": "Summarize the following text:\n{text}",
    "qa": "Answer the question clearly:\n{text}",
    "strict": "Answer in one short sentence only:\n{text}",
    "creative": "Write a creative response for:\n{text}",
}

def load_model():
    global tokenizer, model
    if tokenizer is None or model is None:
        tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
        model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
        model.eval()

def run_prompt_tuning(text: str, mode: str):
    load_model()
    prompt = PROMPTS.get(mode, PROMPTS["summarize"]).format(text=text)
    inputs = tokenizer(prompt, return_tensors="pt")
    output = model.generate(**inputs, max_new_tokens=120)
    return tokenizer.decode(output[0], skip_special_tokens=True)
