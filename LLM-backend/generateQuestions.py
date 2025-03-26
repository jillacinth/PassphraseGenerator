import requests
import json
import re

#Define how many iterations to do
iterations = 10

# Define the URL for the local Ollama API
url = "http://localhost:11434/api/generate"

# Initial prompt to generate 10 questions
data = {
    "model": "deepseek-r1:14b",
    "prompt": "Create a list of ten personal questions with one word or number responses that would be hard for someone to find about you online or for a friend or family member to guess. The answers to these questions should not change over time. There must be more than 50 possible responses to the question. The questions should be widely applicable to most people. Most people should not have the same answer to any of the questions. Do not ask for sensitive information. The questions should be limited to common knowledge. Only output the ten questions labeled 1-10 with no other text output.",
    "stream": False
}

headers = {"Content-Type": "application/json"}

#loop to repeat this the specified amount
for i in (iterations):
    # Send the initial request to generate questions
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        try:
            result = response.json()
            full_response = result.get("response", "")
            
            # Remove everything between <think> and </think> tags
            cleaned_questions = re.sub(r'<think>.*?</think>', '', full_response, flags=re.DOTALL).strip()
            
            # Send the questions back for filtering
            filter_prompt = f"""
            Here are ten personal questions:
            {cleaned_questions}
            
            Return only the questions that meet all of the following criteria:
            - The answers will not change over time.
            - They are hard for someone to find out about you.
            - They are widely applicable to most people.
            - They have a single word or number answer
            - They do not ask for sensitivei information.
            
            Do not include any other text, only the filtered questions with their numerical label.
            """
            
            filter_data = {"model": "deepseek-r1:14b", "prompt": filter_prompt, "stream": False}
            filter_response = requests.post(url, json=filter_data, headers=headers)
            
            if filter_response.status_code == 200:
                try:
                    filtered_result = filter_response.json()
                    filtered_questions = filtered_result.get("response", "")
                    filtered_questions = re.sub(r'<think>.*?</think>', '', filtered_questions, flags=re.DOTALL).strip()
                    # Write the final filtered questions to a file
                    with open("questions.txt", "a", encoding="utf-8") as file:
                        file.write(filtered_questions + "\n")
                    
                    print("Filtered questions written to questions.txt")
                except json.JSONDecodeError as e:
                    print("Error decoding JSON (filtered response):", e)
                    print("Raw response body:", filter_response.text)
            else:
                print(f"Error in filtering step: {filter_response.status_code} - {filter_response.text}")

        except json.JSONDecodeError as e:
            print("Error decoding JSON (initial response):", e)
            print("Raw response body:", response.text)
    else:
        print(f"Error in question generation: {response.status_code} - {response.text}")
