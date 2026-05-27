import logging
from typing import Dict, Tuple
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """Analyzes sentiment in customer interactions."""
    
    def __init__(self):
        """Initialize sentiment analyzer with multiple methods."""
        self.vader_analyzer = SentimentIntensityAnalyzer()
        logger.info("Sentiment analyzer initialized")
    
    def analyze_vader(self, text: str) -> Dict[str, float]:
        """Analyze sentiment using VADER (Valence Aware Dictionary and sEntiment Reasoner).
        
        Args:
            text: Input text to analyze
            
        Returns:
            Dict with sentiment scores
        """
        scores = self.vader_analyzer.polarity_scores(text)
        return {
            'positive': scores['pos'],
            'negative': scores['neg'],
            'neutral': scores['neu'],
            'compound': scores['compound']  # -1 to 1 range
        }
    
    def analyze_textblob(self, text: str) -> Dict[str, float]:
        """Analyze sentiment using TextBlob.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Dict with polarity and subjectivity scores
        """
        blob = TextBlob(text)
        return {
            'polarity': blob.sentiment.polarity,  # -1.0 to 1.0
            'subjectivity': blob.sentiment.subjectivity  # 0.0 to 1.0
        }
    
    def analyze(self, text: str) -> Tuple[str, float]:
        """Analyze overall sentiment and return sentiment label with score.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Tuple of (sentiment_label, confidence_score)
        """
        vader_scores = self.analyze_vader(text)
        compound = vader_scores['compound']
        
        if compound >= 0.05:
            sentiment = 'POSITIVE'
            confidence = vader_scores['positive']
        elif compound <= -0.05:
            sentiment = 'NEGATIVE'
            confidence = vader_scores['negative']
        else:
            sentiment = 'NEUTRAL'
            confidence = vader_scores['neutral']
        
        logger.info(f"Analyzed sentiment: {sentiment} (confidence: {confidence:.2f})")
        return sentiment, confidence
    
    def analyze_conversation(self, messages: list) -> Dict:
        """Analyze sentiment across multiple messages.
        
        Args:
            messages: List of messages to analyze
            
        Returns:
            Dict with overall sentiment analysis
        """
        sentiments = []
        scores = []
        
        for message in messages:
            sentiment, confidence = self.analyze(message)
            sentiments.append(sentiment)
            scores.append(confidence)
        
        sentiment_counts = {
            'POSITIVE': sentiments.count('POSITIVE'),
            'NEGATIVE': sentiments.count('NEGATIVE'),
            'NEUTRAL': sentiments.count('NEUTRAL')
        }
        
        avg_confidence = sum(scores) / len(scores) if scores else 0
        
        return {
            'overall_sentiment': max(sentiment_counts, key=sentiment_counts.get),
            'sentiment_distribution': sentiment_counts,
            'average_confidence': avg_confidence,
            'message_count': len(messages)
        }
