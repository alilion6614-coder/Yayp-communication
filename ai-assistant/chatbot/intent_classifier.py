import numpy as np
from transformers import pipeline
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)

class IntentClassifier:
    """Classifies user intents from text input."""
    
    INTENTS = {
        'greeting': 'GREETING',
        'support': 'CUSTOMER_SUPPORT',
        'billing': 'BILLING_INQUIRY',
        'technical': 'TECHNICAL_ISSUE',
        'sales': 'SALES_INQUIRY',
        'complaint': 'COMPLAINT',
        'feedback': 'FEEDBACK',
        'appointment': 'APPOINTMENT_REQUEST',
        'goodbye': 'GOODBYE'
    }
    
    def __init__(self, model_name: str = 'distilbert-base-uncased-finetuned-sst-2-english'):
        """Initialize the intent classifier."""
        try:
            self.classifier = pipeline('text-classification', model=model_name)
            logger.info(f"Intent classifier initialized with model: {model_name}")
        except Exception as e:
            logger.error(f"Error initializing classifier: {e}")
            self.classifier = None
    
    def classify(self, text: str, threshold: float = 0.7) -> Tuple[str, float]:
        """Classify the intent of input text.
        
        Args:
            text: Input text to classify
            threshold: Confidence threshold for classification
            
        Returns:
            Tuple of (intent, confidence_score)
        """
        if not self.classifier:
            return 'UNKNOWN', 0.0
        
        try:
            result = self.classifier(text)
            label = result[0]['label']
            score = result[0]['score']
            
            if score >= threshold:
                intent = self._map_label_to_intent(label)
                logger.info(f"Classified '{text[:50]}' as {intent} with confidence {score:.2f}")
                return intent, score
            else:
                return 'UNKNOWN', score
                
        except Exception as e:
            logger.error(f"Error classifying text: {e}")
            return 'UNKNOWN', 0.0
    
    def classify_batch(self, texts: List[str], threshold: float = 0.7) -> List[Tuple[str, float]]:
        """Classify multiple texts.
        
        Args:
            texts: List of texts to classify
            threshold: Confidence threshold
            
        Returns:
            List of (intent, score) tuples
        """
        return [self.classify(text, threshold) for text in texts]
    
    @staticmethod
    def _map_label_to_intent(label: str) -> str:
        """Map model labels to predefined intents."""
        label_lower = label.lower()
        for key, intent in IntentClassifier.INTENTS.items():
            if key in label_lower:
                return intent
        return 'UNKNOWN'
