import logging
from flask import Flask
from flask_cors import CORS
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from config.settings import (
    FLASK_ENV, FLASK_DEBUG, SECRET_KEY, API_HOST, API_PORT,
    LOG_LEVEL, LOG_FILE
)
from ai_assistant.chatbot import DialogueManager
from ai_assistant.call_center import CallRouter, SentimentAnalyzer, TranscriptionService
from ai_assistant.api.routes import api, set_services

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def create_app():
    """Create and configure Flask application."""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['JSON_SORT_KEYS'] = False
    
    # Enable CORS
    CORS(app)
    
    # Initialize services
    logger.info("Initializing AI services...")
    dialogue_manager = DialogueManager()
    call_router = CallRouter()
    sentiment_analyzer = SentimentAnalyzer()
    transcription_service = TranscriptionService()
    
    # Pass services to routes
    set_services(dialogue_manager, call_router, sentiment_analyzer, transcription_service)
    
    # Register blueprints
    app.register_blueprint(api)
    
    @app.route('/')
    def index():
        """Root endpoint."""
        return {
            'name': 'Yayp Communication AI Assistant',
            'version': '0.1.0',
            'status': 'running'
        }
    
    logger.info("Flask application created successfully")
    return app

if __name__ == '__main__':
    app = create_app()
    logger.info(f"Starting server on {API_HOST}:{API_PORT}")
    app.run(host=API_HOST, port=API_PORT, debug=FLASK_DEBUG)
