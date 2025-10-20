def register_routes(app):
    from .api_routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
