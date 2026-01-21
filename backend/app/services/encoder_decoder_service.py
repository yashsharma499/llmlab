from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

def generate_encoder_decoder(prompt: str, task: str):
    formatted_prompt = f"{task}: {prompt}"

    inputs = tokenizer(formatted_prompt, return_tensors="pt")
    output = model.generate(**inputs, max_new_tokens=100)

    return tokenizer.decode(output[0], skip_special_tokens=True)
