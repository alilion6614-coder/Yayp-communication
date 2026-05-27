import logging
from typing import Dict, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class ResponseGenerator:
    """Generates appropriate responses based on intent and context."""
    
    RESPONSE_TEMPLATES = {
        'GREETING': [
            "Hello! Welcome to Yayp Communication. How can I assist you today?",
            "Hi there! Thank you for contacting us. What can I help you with?",
            "Welcome! I'm here to help. What do you need?"
        ],
        'CUSTOMER_SUPPORT': [
            "I'd be happy to help with your support issue. Can you provide more details?",
            "Let me assist you with that. Could you describe the problem you're experiencing?",
            "I'm here to help. Please tell me what issue you're facing."
        ],
        'BILLING_INQUIRY': [
            "I can help you with billing questions. What would you like to know?",
            "Let me assist you with your billing. What's your concern?",
            "I'll help clarify your billing. What information do you need?"
        ],
        'TECHNICAL_ISSUE': [
            "I understand you have a technical issue. Let me help troubleshoot.",
            "I can assist with technical problems. Can you explain what's happening?",
            "Let's resolve this technical issue together. Can you provide details?"
        ],
        'SALES_INQUIRY': [
            "Great! I'd love to tell you about our services. What interests you?",
            "Let me share information about our offerings. What are you looking for?",
            "I'm happy to discuss our products and services. What would you like to know?"
        ],
        'COMPLAINT': [
            "I sincerely apologize for the inconvenience. I'll do my best to resolve this.",
            "Thank you for bringing this to our attention. I'm here to help fix this.",
            "I understand your frustration. Let's work together to resolve this."
        ],
        'FEEDBACK': [
            "Thank you for your feedback! We appreciate your input.",
            "We're glad to hear your thoughts. Your feedback helps us improve.",
            "Thank you for sharing. We value your perspective."
        ],
        'APPOINTMENT_REQUEST': [
            "I'd be happy to help you schedule an appointment. When works best for you?",
            "Let me assist with booking an appointment. What time suits you?",
            "I can help schedule that for you. What date and time would you prefer?"
        ],
        'GOODBYE': [
            "Thank you for contacting Yayp Communication. Have a great day!",
            "It was great assisting you. Feel free to reach out anytime!",
            "Goodbye! Thanks for choosing Yayp Communication."
        ],
        'UNKNOWN': [
            "I'm not entirely sure I understood that. Could you rephrase?",
            "I didn't quite catch that. Can you provide more details?",
            "Let me connect you with a specialist who can better assist you."
        ]
    }
    
    def __init__(self, use_llm: bool = False, llm_api_key: Optional[str] = None):
        """Initialize response generator.
        
        Args:
            use_llm: Whether to use LLM for dynamic response generation
            llm_api_key: API key for LLM service
        """
        self.use_llm = use_llm
        self.llm_api_key = llm_api_key
        logger.info(f"Response generator initialized. LLM enabled: {use_llm}")
    
    def generate(self, intent: str, context: Optional[Dict] = None, confidence: float = 0.0) -> str:
        """Generate response based on intent.
        
        Args:
            intent: The classified intent
            context: Additional context information
            confidence: Confidence score from classifier
            
        Returns:
            Generated response string
        """
        import random
        
        # Get template responses for this intent
        templates = self.RESPONSE_TEMPLATES.get(intent, self.RESPONSE_TEMPLATES['UNKNOWN'])
        
        if self.use_llm and confidence > 0.8:
            response = self._generate_with_llm(intent, context)
        else:
            response = random.choice(templates)
        
        logger.info(f"Generated response for intent '{intent}'")
        return response
    
    def _generate_with_llm(self, intent: str, context: Optional[Dict] = None) -> str:
        """Generate response using LLM.
        
        Args:
            intent: The classified intent
            context: Additional context
            
        Returns:
            LLM-generated response
        """
        # Placeholder for LLM integration (OpenAI, HuggingFace, etc.)
        logger.info(f"Using LLM for intent: {intent}")
        return "I'm processing your request with advanced AI. How can I help?"
    
    def add_custom_response(self, intent: str, response: str) -> None:
        """Add custom response template.
        
        Args:
            intent: The intent category
            response: The response template
        """
        if intent not in self.RESPONSE_TEMPLATES:
            self.RESPONSE_TEMPLATES[intent] = []
        self.RESPONSE_TEMPLATES[intent].append(response)
        logger.info(f"Added custom response for intent: {intent}")
