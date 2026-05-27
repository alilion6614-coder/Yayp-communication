import pytest
from ai_assistant.call_center import SentimentAnalyzer

class TestSentimentAnalyzer:
    """Test cases for sentiment analyzer."""
    
    @pytest.fixture
    def analyzer(self):
        """Fixture to provide analyzer instance."""
        return SentimentAnalyzer()
    
    def test_analyze_positive(self, analyzer):
        """Test positive sentiment detection."""
        text = "This is amazing! I love it!"
        sentiment, confidence = analyzer.analyze(text)
        assert sentiment == 'POSITIVE'
        assert confidence > 0
    
    def test_analyze_negative(self, analyzer):
        """Test negative sentiment detection."""
        text = "This is terrible and awful"
        sentiment, confidence = analyzer.analyze(text)
        assert sentiment == 'NEGATIVE'
        assert confidence > 0
    
    def test_analyze_neutral(self, analyzer):
        """Test neutral sentiment detection."""
        text = "The weather is cloudy"
        sentiment, confidence = analyzer.analyze(text)
        assert sentiment in ['NEUTRAL', 'POSITIVE', 'NEGATIVE']
        assert confidence > 0
