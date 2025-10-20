from flask import Blueprint

rag_bp = Blueprint('rag', __name__)

@rag_bp.route('/ingestion', methods=['POST'])
def ingestion():
    return 'hello i am rag ingestion'

@rag_bp.route('/retrieval', methods=['POST'])
def retrieval():
    return 'hello i am rag predict'


# FOR TESTING PART
from ..utils.gemini_utils import ask_gemini

@rag_bp.route('/geminiResponse', methods=['POST'])
def GeminiResponse():
    dummy_context = """
    The IoT-based smart agriculture system is deployed in a chili farm to monitor plant health and optimize crop management.
    It collects real-time data from multiple sensors, including:
    - Temperature sensor: monitors ambient and soil temperature.
    - NPK sensor: measures nutrient levels (Nitrogen, Phosphorus, Potassium) in the soil.
    - Soil moisture sensor: tracks irrigation needs and water availability.
    The system also integrates an image-based disease prediction model capable of detecting common chili plant diseases such as Leaf Curl, Anthracnose, and Bacterial Wilt.
    All sensor readings and disease predictions are used together to guide actionable recommendations for disease mitigation, irrigation, and nutrient management based on the severity of the detected issues.
    """

    dummy_query = """
    The disease 'Leaf Curl' in chili plants has been predicted with 96% confidence.
    My recent sensor readings are:
    - Temperature sensor data: 31.4°C
    - NPK sensor data: N=45 mg/kg, P=22 mg/kg, K=48 mg/kg
    - Moisture sensor data: 18%
    Based on this information, what analysis or recommendations can be inferred?
    """

    # Call your Gemini helper
    response_text = ask_gemini(dummy_context.strip(), dummy_query.strip())
    return response_text

# FOR TESTING PART
from ..utils.embedding_utils import get_embeddings_server

@rag_bp.route('/embeddingHF', methods=['POST'])
def embeddingHF():
    content = 'i am amogh'

    result = get_embeddings_server(content=content)

    return result
