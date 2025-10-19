from flask import Flask
from flask_cors import CORS  # import CORS
from .routes import register_routes

def create_app():
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app)

    # OR if you want to allow only your React frontend:
    # CORS(app, origins=["http://localhost:3000"])

    register_routes(app)
    return app
