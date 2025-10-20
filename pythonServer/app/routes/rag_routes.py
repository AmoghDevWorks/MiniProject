from flask import Blueprint

rag_bp = Blueprint('rag', __name__)

@rag_bp.route('/ingestion', methods=['POST'])
def ingestion():
    return 'hello i am rag ingestion'

@rag_bp.route('/retrieval', methods=['POST'])
def retrieval():
    return 'hello i am rag predict'
