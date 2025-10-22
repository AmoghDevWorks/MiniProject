from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv

rag_bp = Blueprint('rag', __name__)
load_dotenv()

# Define uploads folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Qdrant lazily
qdrant = None
def get_qdrant():
    global qdrant
    if qdrant is None:
        from ..utils.qdrant_utils import QdrantHandler
        qdrant = QdrantHandler(collection_name="pdf_documents", vector_size=384)
    return qdrant

@rag_bp.route('/ingestion', methods=['POST'])
def ingestion():
    """
    PDF ingestion endpoint:
    - Accepts multipart/form-data with a 'file' field
    - Splits PDF into chunks
    - Generates embeddings
    - Upserts into Qdrant
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save file temporarily
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # Lazy imports to avoid Keras3/Transformers conflicts on Flask startup
        from langchain_community.document_loaders import PyPDFLoader
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        from ..utils.embedding_utils import get_embeddings_server

        print(f"📄 Loading PDF: {file_path}")
        loader = PyPDFLoader(file_path)
        pages = loader.load()

        print("✂️ Splitting document into chunks...")
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        chunks = splitter.split_documents(pages)

        print(f"🔢 Generated {len(chunks)} chunks, embedding and storing in Qdrant...")

        texts = [chunk.page_content for chunk in chunks]
        vectors = get_embeddings_server(texts)

        qdrant_instance = get_qdrant()
        for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
            metadata = {
                "page_content": chunk.page_content,
                "source": file.filename,
                "chunk_id": i,
            }
            qdrant_instance.upsert_vector(i, vector, metadata)

        print("✅ PDF ingestion completed successfully!")
        return jsonify({"message": "PDF ingestion completed successfully!", "chunks": len(chunks)}), 200

    except Exception as e:
        print("❌ Ingestion failed:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)


# ============================================================
# RETRIEVAL ROUTE
# ============================================================
@rag_bp.route('/retrieval', methods=['POST'])
def retrieval():
    """Retrieve relevant chunks from Qdrant and get Gemini-based response."""
    try:
        data = request.get_json()
        query = data.get("query")

        if not query:
            return jsonify({"error": "Missing 'query' in request body"}), 400

        # Lazy imports
        from ..utils.embedding_utils import get_embeddings_server
        from ..utils.gemini_utils import ask_gemini

        print("🔍 Searching Qdrant for relevant chunks...")
        query_vector = get_embeddings_server([query])[0]

        qdrant_instance = get_qdrant()
        results = qdrant_instance.search_vectors(query_vector, top_k=5)

        if not results:
            return jsonify({"message": "No matching context found in Qdrant."}), 200

        # Combine retrieved chunks
        context = "\n".join([r["metadata"].get("page_content", "") for r in results])
        

        print("🧠 Sending context + query to Gemini Flash for analysis...")
        answer = ask_gemini(context, query)

        return jsonify({
            "query": query,
            "context_snippets": len(results),
            "response": answer
        }), 200

    except Exception as e:
        print("❌ Retrieval failed:", str(e))
        return jsonify({"error": str(e)}), 500

# FOR TESTING PART
# from ..utils.gemini_utils import ask_gemini

# @rag_bp.route('/geminiResponse', methods=['POST'])
# def GeminiResponse():
#     dummy_context = """
#     The IoT-based smart agriculture system is deployed in a chili farm to monitor plant health and optimize crop management.
#     It collects real-time data from multiple sensors, including:
#     - Temperature sensor: monitors ambient and soil temperature.
#     - NPK sensor: measures nutrient levels (Nitrogen, Phosphorus, Potassium) in the soil.
#     - Soil moisture sensor: tracks irrigation needs and water availability.
#     The system also integrates an image-based disease prediction model capable of detecting common chili plant diseases such as Leaf Curl, Anthracnose, and Bacterial Wilt.
#     All sensor readings and disease predictions are used together to guide actionable recommendations for disease mitigation, irrigation, and nutrient management based on the severity of the detected issues.
#     """

#     dummy_query = """
#     The disease 'Leaf Curl' in chili plants has been predicted with 96% confidence.
#     My recent sensor readings are:
#     - Temperature sensor data: 31.4°C
#     - NPK sensor data: N=45 mg/kg, P=22 mg/kg, K=48 mg/kg
#     - Moisture sensor data: 18%
#     Based on this information, what analysis or recommendations can be inferred?
#     """

#     # Call your Gemini helper
#     response_text = ask_gemini(dummy_context.strip(), dummy_query.strip())
#     return response_text

# FOR TESTING PART

# @rag_bp.route('/embeddingHF', methods=['POST'])
# def embeddingHF():
#     content = 'i am amogh'

#     result = get_embeddings_server(content=content)

#     return result
