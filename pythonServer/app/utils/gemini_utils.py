from google import genai
from dotenv import load_dotenv
from google.genai import types
import os
from pydantic import BaseModel
from typing import List,Optional

load_dotenv()

# Initialize Google Gemini client (API key picked automatically from env)
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

SYSTEM_INSTRUCTION = """
You are an analytical assistant specialized in IoT-based crop monitoring and plant disease management.
Always interpret the chilli leaf curl detection result and confidence.
Based on the confidence level and IoT sensor data (temperature, NPK levels, soil moisture), provide short, factual, and context-aware recommendations.
Avoid speculation or made-up data.
Keep all responses concise (under 80 words) and factual.
Respond strictly in valid JSON matching the given schema.
"""

# base models
class Recommendation(BaseModel):
    """ond ond ee recommendation ge"""
    action: str
    reason: Optional[str] = None

class DiseaseReport(BaseModel):
    """OverAll du"""
    recommendations: List[Recommendation]
    notes: str

def ask_gemini(context: str, query: str) -> DiseaseReport | None:
    """
    Send context + query to Google Gemini 2.5 Flash and return a structured DiseaseReport.
    Returns None if request fails or schema mismatch occurs.
    """
    prompt = f"Context:\n{context}\n\nIoT Data / Query:\n{query}"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.1,
                response_mime_type="application/json",
                response_schema=DiseaseReport 
            )
        )

        result: DiseaseReport = response.parsed 
        return result.model_dump()

    except Exception as e:
        print("❌ Error calling Google Gemini 2.5 Flash:", e)
        return None