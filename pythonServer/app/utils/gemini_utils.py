from google import genai
from dotenv import load_dotenv
from google.genai import types
import os

load_dotenv()

# Initialize Google Gemini client (API key picked automatically from env)
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

SYSTEM_INSTRUCTION = """
You are an analytical assistant specialized in IoT-based crop monitoring and plant disease management.
Always start by acknowledging the disease detection result, including the confidence level for chilli leaf curl.
Based on the severity indicated by the confidence level and the sensor data (temperature, NPK levels, soil moisture), provide practical, factual, and context-aware recommendations to cure or mitigate the disease.
Avoid speculation or fabricated information. If information is insufficient, clearly state that.
Keep the response concise, actionable, and under 60-80 words.
"""

def ask_gemini(context: str, query: str) -> str:
    """
    Send context + query to Google Gemini 2.5 Flash and return the AI's text answer.
    """
    prompt = f"Context:\n{context}\n\nIoT Data / Query:\n{query}"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.1,
            ),
            contents=prompt
        )
        return response.text
    except Exception as e:
        print("❌ Error calling Google Gemini 2.5 Flash:", e)
        return "Error: Unable to get response from Gemini."
