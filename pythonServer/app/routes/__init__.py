def register_routes(app):
    from .api_routes import api_bp
    from .tag_routes import tag_bp

    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(tag_bp,url_prefix='/rag')
