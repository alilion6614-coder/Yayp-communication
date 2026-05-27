import logging
import re
from typing import List
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

logger = logging.getLogger(__name__)

class TextPreprocessor:
    """Preprocesses text for NLP tasks."""
    
    def __init__(self):
        """Initialize preprocessor and download required NLTK data."""
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
        
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')
        
        try:
            nltk.data.find('corpora/wordnet')
        except LookupError:
            nltk.download('wordnet')
        
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        logger.info("Text preprocessor initialized")
    
    def clean_text(self, text: str) -> str:
        """Clean text by removing special characters and extra whitespace.
        
        Args:
            text: Input text
            
        Returns:
            Cleaned text
        """
        # Convert to lowercase
        text = text.lower()
        # Remove URLs
        text = re.sub(r'http\S+|www\S+', '', text)
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        # Remove special characters
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def tokenize(self, text: str) -> List[str]:
        """Tokenize text into words.
        
        Args:
            text: Input text
            
        Returns:
            List of tokens
        """
        return word_tokenize(text)
    
    def remove_stopwords(self, tokens: List[str]) -> List[str]:
        """Remove stopwords from tokens.
        
        Args:
            tokens: List of tokens
            
        Returns:
            Filtered tokens
        """
        return [token for token in tokens if token.lower() not in self.stop_words]
    
    def lemmatize(self, tokens: List[str]) -> List[str]:
        """Lemmatize tokens.
        
        Args:
            tokens: List of tokens
            
        Returns:
            Lemmatized tokens
        """
        return [self.lemmatizer.lemmatize(token) for token in tokens]
    
    def preprocess(self, text: str, remove_stopwords: bool = True) -> List[str]:
        """Full preprocessing pipeline.
        
        Args:
            text: Input text
            remove_stopwords: Whether to remove stopwords
            
        Returns:
            Preprocessed tokens
        """
        text = self.clean_text(text)
        tokens = self.tokenize(text)
        if remove_stopwords:
            tokens = self.remove_stopwords(tokens)
        tokens = self.lemmatize(tokens)
        logger.info(f"Preprocessed text into {len(tokens)} tokens")
        return tokens
