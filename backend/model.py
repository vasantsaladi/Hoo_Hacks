from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("microsoft/phi-1_5")
tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-1_5")

def generate_recommendation(prediction: float) -> str:
    prompt = f"""Given predicted food waste of {prediction}kg, generate 3 inventory optimization recommendations:
    1. """
    inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
    outputs = model.generate(**inputs, max_new_tokens=150)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)