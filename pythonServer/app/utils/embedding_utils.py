import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

def get_embeddings_server(content, model_name="sentence-transformers/all-MiniLM-L6-v2"):
    """
    Generate embeddings using Hugging Face server (Inference API).
    Requires HUGGINGFACEHUB_API_TOKEN set in .env
    """
    hf_api_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    if not hf_api_key:
        raise ValueError("HUGGINGFACEHUB_API_TOKEN not found in environment!")
    
    # Set it in env for HuggingFaceEmbeddings
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = hf_api_key

    # Initialize embeddings
    embeddings_client = HuggingFaceEmbeddings(model_name=model_name)

    # Embed single string or list of strings
    if isinstance(content, str):
        return embeddings_client.embed_query(content)
    elif isinstance(content, list):
        return embeddings_client.embed_documents(content)
    else:
        raise TypeError("content must be a string or list of strings")
