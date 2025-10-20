from flask import Blueprint, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

api_bp = Blueprint('api', __name__)

# Load model at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../model/DiseaseDetection.h5')
model = load_model(MODEL_PATH)

# Define uploads folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create folder if it doesn't exist

# Prediction function
def predict_leaf(img_path):
    """
    Predicts if a chilli leaf image is Healthy or Diseased
    """
    # Load and preprocess image
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Make prediction
    pred = model.predict(img_array)[0][0]

    # Interpret result
    if pred <= 0.5:
        pred_percent = (1 - float(pred))  # flip for disease
        return "Disease", pred_percent
    else:
        pred_percent = float(pred)  # healthy as is
        return "Healthy", pred_percent

# API route
@api_bp.route('/predict', methods=['POST'])
def predict():
    try:
        # Ensure file is in request
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']

        # Save the uploaded file in the uploads folder
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        # Get prediction
        label, confidence = predict_leaf(file_path)

        # Remove uploaded file after prediction (optional)
        os.remove(file_path)

        return jsonify({
            "label": label,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
