import os
from qdrant_client import QdrantClient, models

class QdrantHandler:
    def __init__(self, collection_name: str, vector_size: int):
        """
        Initialize Qdrant client using API key and URL from environment.
        """
        self.url = os.getenv("QDRANT_URL", "http://localhost:6333")
        self.api_key = os.getenv("QDRANT_API_KEY")
        self.collection_name = collection_name

        self.client = QdrantClient(url=self.url, api_key=self.api_key)
        print(f"✅ Connected to Qdrant at {self.url}")

        # Ensure collection exists
        self._ensure_collection(vector_size)

    def _ensure_collection(self, vector_size: int):
        if not self.client.collection_exists(self.collection_name):
            print(f"📘 Creating new Qdrant collection: {self.collection_name}")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE)
            )

    def upsert_vector(self, idx: int, vector, metadata: dict):
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(id=idx, vector=vector, payload=metadata)
            ]
        )

    def search_vectors(self, query_vector, top_k: int = 5):
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )
        results = []
        for res in search_results:
            results.append({
                "id": res.id,
                "score": res.score,
                "metadata": res.payload
            })
        return results
