from dataclasses import dataclass, asdict
from typing import Optional, Dict, Any
from enum import Enum

class IntentEnum(str, Enum):
    """Intent enumeration."""
    GREETING = 'GREETING'
    SUPPORT = 'CUSTOMER_SUPPORT'
    BILLING = 'BILLING_INQUIRY'
    TECHNICAL = 'TECHNICAL_ISSUE'
    SALES = 'SALES_INQUIRY'
    COMPLAINT = 'COMPLAINT'
    FEEDBACK = 'FEEDBACK'
    APPOINTMENT = 'APPOINTMENT_REQUEST'
    GOODBYE = 'GOODBYE'
    UNKNOWN = 'UNKNOWN'

class SentimentEnum(str, Enum):
    """Sentiment enumeration."""
    POSITIVE = 'POSITIVE'
    NEGATIVE = 'NEGATIVE'
    NEUTRAL = 'NEUTRAL'

@dataclass
class ChatRequest:
    """Chat API request model."""
    session_id: str
    message: str
    customer_id: Optional[str] = None

@dataclass
class ChatResponse:
    """Chat API response model."""
    message: str
    intent: str
    confidence: float
    sentiment: Optional[str] = None
    session_id: str = ""
    timestamp: str = ""

@dataclass
class CallRoutingRequest:
    """Call routing request model."""
    customer_id: str
    intent: str
    priority: int = 1

@dataclass
class CallRoutingResponse:
    """Call routing response model."""
    customer_id: str
    department: str
    queue_position: int
    priority: int
    timestamp: str

@dataclass
class TranscriptionRequest:
    """Transcription request model."""
    audio_source: str  # file path or 'microphone'
    language: str = 'en-US'
    call_id: Optional[str] = None

@dataclass
class TranscriptionResponse:
    """Transcription response model."""
    call_id: str
    text: str
    duration: float
    timestamp: str
    word_count: int
