import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

# Initialize HF Inference client with API key
client = InferenceClient(token=os.getenv("HUGGINGFACEHUB_API_KEY"))

MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"

def embed_text(text: str):
    """
    Generate embedding vector from Hugging Face Inference API (server-side).
    Returns a list of floats.
    """
    try:
        # Use feature_extraction to get embeddings
        response = client.feature_extraction(model=MODEL_ID, inputs=text)
        return response  # list of floats
    except Exception as e:
        print("Error generating embedding:", e)
        return None
