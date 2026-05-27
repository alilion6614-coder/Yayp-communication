import pytest
from ai_assistant.chatbot import IntentClassifier

class TestIntentClassifier:
    """Test cases for intent classifier."""
    
    @pytest.fixture
    def classifier(self):
        """Fixture to provide classifier instance."""
        return IntentClassifier()
    
    def test_classify_greeting(self, classifier):
        """Test greeting intent classification."""
        text = "Hello, how are you?"
        intent, confidence = classifier.classify(text)
        assert intent in ['GREETING', 'UNKNOWN']
        assert 0 <= confidence <= 1
    
    def test_classify_support(self, classifier):
        """Test support intent classification."""
        text = "I need help with my account"
        intent, confidence = classifier.classify(text)
        assert intent in ['CUSTOMER_SUPPORT', 'UNKNOWN']
        assert 0 <= confidence <= 1
    
    def test_classify_batch(self, classifier):
        """Test batch classification."""
        texts = ["Hello", "I need help", "Goodbye"]
        results = classifier.classify_batch(texts)
        assert len(results) == 3
        for intent, confidence in results:
            assert isinstance(intent, str)
            assert 0 <= confidence <= 1
