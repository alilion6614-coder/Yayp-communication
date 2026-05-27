import os
from dotenv import load_dotenv

load_dotenv()

# Flask Configuration
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
FLASK_DEBUG = os.getenv('FLASK_DEBUG', True)
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')

# API Configuration
API_HOST = os.getenv('API_HOST', '0.0.0.0')
API_PORT = int(os.getenv('API_PORT', 5000))

# AI Model Configuration
DEFAULT_LANGUAGE_MODEL = os.getenv('LANGUAGE_MODEL', 'distilbert-base-uncased-finetuned-sst-2-english')
INTENT_CONFIDENCE_THRESHOLD = float(os.getenv('INTENT_THRESHOLD', 0.7))

# Call Center Configuration
CALL_CENTER_ENABLED = os.getenv('CALL_CENTER_ENABLED', True)
AUTO_TRANSCRIPTION = os.getenv('AUTO_TRANSCRIPTION', True)
SENTIMENT_ANALYSIS_ENABLED = os.getenv('SENTIMENT_ANALYSIS', True)

# Response Generation
USE_LLM = os.getenv('USE_LLM', False)  # Set to True for OpenAI/HuggingFace integration
LLM_API_KEY = os.getenv('LLM_API_KEY', '')
LLM_MODEL = os.getenv('LLM_MODEL', 'gpt-3.5-turbo')

# Logging
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FILE = os.getenv('LOG_FILE', 'logs/app.log')

# Database (optional)
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///yayp.db')
