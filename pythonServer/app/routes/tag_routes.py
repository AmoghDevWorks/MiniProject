from flask import Blueprint, request, jsonify
import io
import pandas as pd
from app.utils.qdrant_utils import create_collection, store_document, store_batch
from app.utils.gemini_utils import ask_gemini_with_context

tag_bp = Blueprint("tag_bp", __name__)

# Initialize Qdrant collection on server start
create_collection()


@tag_bp.route("/add", methods=["POST"])
def add_doc():
    data = request.get_json()
    text = data.get("text")
    doc_id = data.get("id")
    if not text or not doc_id:
        return jsonify({"error": "id and text are required"}), 400
    store_document(id=doc_id, text=text)
    return jsonify({"message": "Document stored successfully"})


@tag_bp.route("/batch-upload", methods=["POST"])
def batch_upload():
    """Upload TXT or CSV, split docs, embed using HF API, and store in Qdrant."""
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = file.filename.lower()
    docs = []

    if filename.endswith(".txt"):
        content = file.read().decode("utf-8").strip().splitlines()
        docs = [{"id": i + 1, "text": line.strip()} for i, line in enumerate(content) if line.strip()]
    elif filename.endswith(".csv"):
        df = pd.read_csv(io.StringIO(file.read().decode("utf-8")))
        if "text" not in df.columns:
            return jsonify({"error": "CSV must contain a 'text' column"}), 400
        docs = [{"id": i + 1, "text": row["text"]} for i, row in df.iterrows()]
    else:
        return jsonify({"error": "Only .txt or .csv files are supported"}), 400

    if not docs:
        return jsonify({"error": "No valid text entries found"}), 400

    store_batch(docs)  # embed_text() inside Qdrant utils uses HF API
    return jsonify({"message": f"✅ Stored {len(docs)} documents successfully"})


@tag_bp.route("/ask", methods=["POST"])
def ask():
    """Query stored docs with Gemini using server-side embeddings."""
    data = request.get_json()
    query = data.get("query")
    if not query:
        return jsonify({"error": "query is required"}), 400

    result = ask_gemini_with_context(query)
    return jsonify(result)
