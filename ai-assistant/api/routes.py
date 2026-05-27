import logging
from flask import request, jsonify, Blueprint
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

api = Blueprint('api', __name__, url_prefix='/api/v1')

# Will be injected from main app
dialogue_manager = None
call_router = None
sentiment_analyzer = None
transcription_service = None

def set_services(dm, cr, sa, ts):
    """Set service instances for routes."""
    global dialogue_manager, call_router, sentiment_analyzer, transcription_service
    dialogue_manager = dm
    call_router = cr
    sentiment_analyzer = sa
    transcription_service = ts

# ===== Chat Routes =====
@api.route('/chat/start', methods=['POST'])
def start_chat():
    """Start a new chat session."""
    data = request.json
    session_id = data.get('session_id')
    
    if not session_id:
        return jsonify({'error': 'session_id is required'}), 400
    
    greeting = dialogue_manager.start_conversation(session_id)
    return jsonify({
        'session_id': session_id,
        'message': greeting,
        'timestamp': datetime.now().isoformat()
    }), 200

@api.route('/chat/message', methods=['POST'])
def send_message():
    """Send a message and get response."""
    data = request.json
    session_id = data.get('session_id')
    message = data.get('message')
    
    if not session_id or not message:
        return jsonify({'error': 'session_id and message are required'}), 400
    
    response = dialogue_manager.process_message(session_id, message)
    history = dialogue_manager.get_conversation_history(session_id)
    last_turn = history[-1]
    
    sentiment, sentiment_confidence = sentiment_analyzer.analyze(message)
    
    return jsonify({
        'session_id': session_id,
        'message': response,
        'intent': last_turn.intent,
        'intent_confidence': last_turn.confidence,
        'sentiment': sentiment,
        'sentiment_confidence': sentiment_confidence,
        'timestamp': datetime.now().isoformat()
    }), 200

@api.route('/chat/history/<session_id>', methods=['GET'])
def get_history(session_id):
    """Get conversation history."""
    history = dialogue_manager.get_conversation_history(session_id)
    
    return jsonify({
        'session_id': session_id,
        'history': [
            {
                'user_message': turn.user_message,
                'bot_response': turn.bot_response,
                'intent': turn.intent,
                'confidence': turn.confidence,
                'timestamp': turn.timestamp
            }
            for turn in history
        ],
        'total_turns': len(history)
    }), 200

@api.route('/chat/summary/<session_id>', methods=['GET'])
def get_summary(session_id):
    """Get conversation summary."""
    summary = dialogue_manager.get_conversation_summary(session_id)
    return jsonify(summary), 200

@api.route('/chat/end/<session_id>', methods=['POST'])
def end_chat(session_id):
    """End chat session."""
    goodbye = dialogue_manager.end_conversation(session_id)
    return jsonify({
        'session_id': session_id,
        'message': goodbye,
        'timestamp': datetime.now().isoformat()
    }), 200

# ===== Call Center Routes =====
@api.route('/calls/route', methods=['POST'])
def route_call():
    """Route a call to appropriate department."""
    data = request.json
    customer_id = data.get('customer_id')
    intent = data.get('intent')
    priority = data.get('priority', 1)
    
    if not customer_id or not intent:
        return jsonify({'error': 'customer_id and intent are required'}), 400
    
    routing_info = call_router.route_call(intent, customer_id, priority)
    return jsonify(routing_info), 200

@api.route('/calls/queue', methods=['GET'])
def get_queue():
    """Get current queue status."""
    queue_status = call_router.get_queue_status()
    return jsonify(queue_status), 200

# ===== Transcription Routes =====
@api.route('/transcribe', methods=['POST'])
def transcribe():
    """Transcribe audio file or microphone input."""
    data = request.json
    audio_source = data.get('audio_source')
    language = data.get('language', 'en-US')
    call_id = data.get('call_id', f"call_{datetime.now().timestamp()}")
    
    if not audio_source:
        return jsonify({'error': 'audio_source is required'}), 400
    
    try:
        if audio_source == 'microphone':
            text = transcription_service.transcribe_microphone(language=language)
        else:
            text = transcription_service.transcribe_audio(audio_source, language)
        
        if not text:
            return jsonify({'error': 'Transcription failed'}), 500
        
        transcription_service.store_transcription(call_id, text, 0)
        return jsonify({
            'call_id': call_id,
            'text': text,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        return jsonify({'error': str(e)}), 500

# ===== Health Check =====
@api.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    }), 200
