from flask import Flask

def create_app():
    app = Flask(__name__)

    # Import and register blueprints
    from .routes import register_routes
    register_routes(app)

    from .home_routes import home_bp
    app.register_blueprint(home_bp)

    return app
