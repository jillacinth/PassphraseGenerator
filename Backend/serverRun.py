import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import re
import json

# Check if GPU is available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Model name - using DeepSeek-R1
model_name = "deepseek-ai/DeepSeek-R1"
print(f"Loading {model_name}...")

# Load model and tokenizer with GPU optimization
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,  # Use half precision for memory efficiency
    trust_remote_code=True,
    device_map="auto"  # Automatically handle model deployment across available GPUs
)

def generate_text(prompt, max_length=2048):
    """Generate text using the DeepSeek-R1 model following their recommendations"""
    # Enforce thinking pattern by requiring the model to start with <think>
    full_prompt = f"{prompt}\n\nStart your response with <think>\n"
    
    inputs = tokenizer(full_prompt, return_tensors="pt").to(device)
    
    # Set up generation parameters following DeepSeek-R1 recommendations
    generation_config = {
        "max_length": max_length,
        "temperature": 0.6,  # Recommended temperature
        "top_p": 0.95,
        "do_sample": True,
        "pad_token_id": tokenizer.eos_token_id
    }
    
    # Generate text
    with torch.no_grad():
        outputs = model.generate(**inputs, **generation_config)
    
    # Decode the output
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Remove the prompt from the response
    if response.startswith(full_prompt):
        response = response[len(full_prompt):].strip()
    
    return response

# Initial prompt to generate 10 questions (no system prompt as recommended)
initial_prompt = """Create a list of ten personal questions with one word or number responses that would be hard for someone to find about you online or for a friend or family member to guess. The answers to these questions should not change over time. There must be more than 50 possible responses to the question. The questions should be widely applicable to most people. Most people should not have the same answer to any of the questions. Do not ask for sensitive information. The questions should be limited to common knowledge. Only output the ten questions labeled 1-10 with no other text output."""

print("Generating initial questions...")
full_response = generate_text(initial_prompt)

# Remove everything between <think> and </think> tags
cleaned_questions = re.sub(r'<think>.*?</think>', '', full_response, flags=re.DOTALL).strip()

print("Initial questions generated. Filtering...")

# Send the questions back for filtering (with no system prompt)
filter_prompt = f"""
Here are ten personal questions:
{cleaned_questions}

Return only the questions that meet all of the following criteria:
- The answers will not change over time.
- They are hard for someone to find out about you.
- They are widely applicable to most people.
- They have a single word or number answer
- They do not ask for sensitive information.

Do not include any other text, only the filtered questions with their numerical label.
"""

filtered_questions = generate_text(filter_prompt)
filtered_questions = re.sub(r'<think>.*?</think>', '', filtered_questions, flags=re.DOTALL).strip()

# Write the final filtered questions to a file
with open("questions.txt", "a", encoding="utf-8") as file:
    file.write(filtered_questions + "\n")

print("Filtered questions written to questions.txt")

# Clean up GPU memory
if device == "cuda":
    torch.cuda.empty_cache()