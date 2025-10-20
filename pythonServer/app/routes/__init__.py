def register_routes(app):
    from .api_routes import api_bp
    from .rag_routes import rag_bp

    app.register_blueprint(rag_bp, url_prefix='/rag')
    app.register_blueprint(api_bp, url_prefix='/api')
