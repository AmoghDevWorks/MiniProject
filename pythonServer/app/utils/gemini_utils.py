import os
import google.generativeai as genai
from dotenv import load_dotenv
from .qdrant_utils import search_documents

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def ask_gemini_with_context(query: str, limit: int = 3):
    docs = search_documents(query, limit)
    context = "\n".join(d["text"] for d in docs)

    prompt = f"""
    Context:
    {context}

    Question:
    {query}

    Answer clearly and concisely using the above context.
    """

    response = model.generate_content(prompt)
    return {"answer": response.text, "context_docs": docs}
