import re
import mysql.connector
from dbconfig import db_config

def extract_questions(file_path):
    questions = []
    seen_questions = set()  # Set to track seen questions
    pattern = re.compile(r'^(\d+)\.\s*(.*?)(?=\s*(?:\*\*|$|Answer:))')  # Capture the question text before answers
    
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # Skip lines that are empty or contain only hyphens
            if not line or line.startswith('-'):
                i += 1
                continue
            
            # Match valid question format
            match = pattern.match(line)
            if match:
                question_number, question_text = match.groups()
                
                # Skip next line if it's an example answer
                if i + 1 < len(lines) and lines[i + 1].strip().lower().startswith("answer:"):
                    i += 2  # Skip the question and its answer line
                else:
                    question_text = question_text.strip()
                    if question_text and question_text not in seen_questions:  # Only add if non-empty and not a duplicate
                        questions.append((question_text,))
                        seen_questions.add(question_text)  # Mark this question as seen
                    i += 1  # Move to the next line
            else:
                i += 1  # Move to the next line if no question was matched
    
    questions = [q for q in questions if q[0].strip()]
    return questions

def upload_to_mysql(questions, db_config):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        cursor.executemany("""
            INSERT INTO SecurityQs (QContent) VALUES (%s)
        """, questions)
        
        conn.commit()
        print(f"{cursor.rowcount} questions uploaded successfully.")
    
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    file_path = "questions.txt"
    
    questions = extract_questions(file_path)
    
    print("Filtered Questions:")
    for q in questions:
        print(f"- {q[0]}")
    confirm = input("Do you want to upload these questions? (yes/no): ").strip().lower()
    if confirm == "yes":
        upload_to_mysql(questions, db_config)
    else:
        print("Upload canceled.")