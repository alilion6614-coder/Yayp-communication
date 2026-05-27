import logging
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
from .intent_classifier import IntentClassifier
from .response_generator import ResponseGenerator

logger = logging.getLogger(__name__)

@dataclass
class ConversationTurn:
    """Represents a single turn in conversation."""
    user_message: str
    intent: str
    confidence: float
    bot_response: str
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

class DialogueManager:
    """Manages multi-turn conversations with context tracking."""
    
    def __init__(self, intent_threshold: float = 0.7):
        """Initialize dialogue manager.
        
        Args:
            intent_threshold: Minimum confidence for intent classification
        """
        self.classifier = IntentClassifier()
        self.generator = ResponseGenerator()
        self.intent_threshold = intent_threshold
        self.conversations: Dict[str, List[ConversationTurn]] = {}
        logger.info("Dialogue manager initialized")
    
    def start_conversation(self, session_id: str) -> str:
        """Start a new conversation session.
        
        Args:
            session_id: Unique conversation ID
            
        Returns:
            Initial greeting message
        """
        if session_id not in self.conversations:
            self.conversations[session_id] = []
        
        greeting = self.generator.generate('GREETING')
        logger.info(f"Started conversation with session: {session_id}")
        return greeting
    
    def process_message(self, session_id: str, user_message: str) -> str:
        """Process user message and generate response.
        
        Args:
            session_id: Conversation session ID
            user_message: User's input message
            
        Returns:
            Bot response message
        """
        if session_id not in self.conversations:
            self.conversations[session_id] = []
        
        # Classify intent
        intent, confidence = self.classifier.classify(user_message, self.intent_threshold)
        
        # Generate response
        bot_response = self.generator.generate(intent, confidence=confidence)
        
        # Store conversation turn
        turn = ConversationTurn(
            user_message=user_message,
            intent=intent,
            confidence=confidence,
            bot_response=bot_response
        )
        self.conversations[session_id].append(turn)
        
        logger.info(f"Processed message in session {session_id}. Intent: {intent}")
        return bot_response
    
    def get_conversation_history(self, session_id: str) -> List[ConversationTurn]:
        """Get full conversation history.
        
        Args:
            session_id: Conversation session ID
            
        Returns:
            List of conversation turns
        """
        return self.conversations.get(session_id, [])
    
    def get_conversation_summary(self, session_id: str) -> Dict:
        """Get conversation summary.
        
        Args:
            session_id: Conversation session ID
            
        Returns:
            Summary dict with statistics
        """
        history = self.get_conversation_history(session_id)
        
        if not history:
            return {'total_turns': 0, 'intents': {}}
        
        intents = {}
        for turn in history:
            intents[turn.intent] = intents.get(turn.intent, 0) + 1
        
        return {
            'total_turns': len(history),
            'intents': intents,
            'start_time': history[0].timestamp,
            'last_turn': history[-1].timestamp
        }
    
    def end_conversation(self, session_id: str) -> str:
        """End conversation and return goodbye message.
        
        Args:
            session_id: Conversation session ID
            
        Returns:
            Goodbye message
        """
        goodbye = self.generator.generate('GOODBYE')
        logger.info(f"Ended conversation with session: {session_id}")
        return goodbye
