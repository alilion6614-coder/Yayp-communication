import logging
import re
from typing import Dict, List
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class Entity:
    """Represents an extracted entity."""
    type: str
    value: str
    start: int
    end: int

class EntityExtractor:
    """Extracts named entities from text."""
    
    PATTERNS = {
        'EMAIL': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        'PHONE': r'\b(?:\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b',
        'URL': r'https?://\S+|www\.\S+',
        'DATE': r'\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b',
        'TIME': r'\b(?:0?\d|1\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:\s?[AP]M)?\b',
        'PRICE': r'\$[0-9]+(?:,[0-9]{3})*(?:\.[0-9]{2})?',
        'ACCOUNT_ID': r'#[A-Z0-9]{4,}'
    }
    
    def __init__(self):
        """Initialize entity extractor."""
        logger.info("Entity extractor initialized")
    
    def extract_entities(self, text: str) -> Dict[str, List[Entity]]:
        """Extract all entities from text.
        
        Args:
            text: Input text
            
        Returns:
            Dict with entity types as keys and Entity objects as values
        """
        entities_dict = {}
        
        for entity_type, pattern in self.PATTERNS.items():
            entities = []
            for match in re.finditer(pattern, text, re.IGNORECASE):
                entity = Entity(
                    type=entity_type,
                    value=match.group(),
                    start=match.start(),
                    end=match.end()
                )
                entities.append(entity)
            
            if entities:
                entities_dict[entity_type] = entities
        
        logger.info(f"Extracted {sum(len(e) for e in entities_dict.values())} entities")
        return entities_dict
    
    def extract_entity_type(self, text: str, entity_type: str) -> List[Entity]:
        """Extract specific entity type from text.
        
        Args:
            text: Input text
            entity_type: Type of entity to extract
            
        Returns:
            List of extracted entities
        """
        pattern = self.PATTERNS.get(entity_type)
        if not pattern:
            logger.warning(f"Unknown entity type: {entity_type}")
            return []
        
        entities = []
        for match in re.finditer(pattern, text, re.IGNORECASE):
            entity = Entity(
                type=entity_type,
                value=match.group(),
                start=match.start(),
                end=match.end()
            )
            entities.append(entity)
        
        return entities
    
    def add_custom_pattern(self, entity_type: str, pattern: str) -> None:
        """Add custom entity extraction pattern.
        
        Args:
            entity_type: Name of entity type
            pattern: Regex pattern to match
        """
        self.PATTERNS[entity_type] = pattern
        logger.info(f"Added custom pattern for {entity_type}")
