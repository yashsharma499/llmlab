from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_NAME = "distilgpt2"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

tokenizer.pad_token = tokenizer.eos_token
model.eval()

def generate_decoder(prompt: str):
    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        padding=True
    )
    output = model.generate(
        **inputs,
        max_new_tokens=80,
        temperature=0.7,
        do_sample=True,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.eos_token_id
    )
    return tokenizer.decode(output[0], skip_special_tokens=True)

