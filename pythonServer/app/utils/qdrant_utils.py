import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
from .embeddings import embed_text

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
COLLECTION_NAME = "docs_collection"


def create_collection():
    """Create or verify Qdrant collection."""
    collections = qdrant.get_collections().collections
    if any(c.name == COLLECTION_NAME for c in collections):
        print("✅ Collection already exists.")
        return
    qdrant.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
    )
    print("✅ Collection created.")


def store_document(id: int, text: str, metadata: dict = None):
    """Store single document."""
    vector = embed_text(text)
    payload = {"text": text}
    if metadata:
        payload.update(metadata)

    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[models.PointStruct(id=id, vector=vector, payload=payload)],
    )


def store_batch(docs: list):
    """Store multiple docs (list of {'id': int, 'text': str})."""
    points = []
    for d in docs:
        vector = embed_text(d["text"])
        points.append(models.PointStruct(id=d["id"], vector=vector, payload={"text": d["text"]}))
    qdrant.upsert(collection_name=COLLECTION_NAME, points=points)


def search_documents(query: str, limit: int = 3):
    """Semantic search."""
    query_vector = embed_text(query)
    results = qdrant.search(collection_name=COLLECTION_NAME, query_vector=query_vector, limit=limit)
    return [{"id": r.id, "score": r.score, "text": r.payload.get("text", "")} for r in results]
