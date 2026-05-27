import logging
from typing import Optional, List
from datetime import datetime
import speech_recognition as sr

logger = logging.getLogger(__name__)

class TranscriptionService:
    """Handles call transcription and audio processing."""
    
    def __init__(self):
        """Initialize transcription service."""
        self.recognizer = sr.Recognizer()
        self.transcriptions: dict = {}
        logger.info("Transcription service initialized")
    
    def transcribe_audio(self, audio_file_path: str, language: str = 'en-US') -> Optional[str]:
        """Transcribe audio file to text.
        
        Args:
            audio_file_path: Path to audio file
            language: Language code for transcription
            
        Returns:
            Transcribed text or None on error
        """
        try:
            with sr.AudioFile(audio_file_path) as source:
                audio_data = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio_data, language=language)
                logger.info(f"Successfully transcribed audio: {audio_file_path}")
                return text
        except sr.UnknownValueError:
            logger.warning(f"Could not understand audio from {audio_file_path}")
            return None
        except sr.RequestError as e:
            logger.error(f"Transcription error: {e}")
            return None
    
    def transcribe_microphone(self, duration: int = 10, language: str = 'en-US') -> Optional[str]:
        """Transcribe from microphone input.
        
        Args:
            duration: Recording duration in seconds
            language: Language code
            
        Returns:
            Transcribed text or None on error
        """
        try:
            with sr.Microphone() as source:
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                audio_data = self.recognizer.listen(source, timeout=duration)
                text = self.recognizer.recognize_google(audio_data, language=language)
                logger.info("Successfully transcribed microphone input")
                return text
        except sr.UnknownValueError:
            logger.warning("Could not understand microphone input")
            return None
        except sr.RequestError as e:
            logger.error(f"Microphone transcription error: {e}")
            return None
    
    def store_transcription(self, call_id: str, transcription: str, duration: float) -> None:
        """Store transcription record.
        
        Args:
            call_id: Unique call identifier
            transcription: Transcribed text
            duration: Call duration in seconds
        """
        self.transcriptions[call_id] = {
            'text': transcription,
            'duration': duration,
            'timestamp': datetime.now().isoformat(),
            'length': len(transcription.split())
        }
        logger.info(f"Stored transcription for call {call_id}")
    
    def get_transcription(self, call_id: str) -> Optional[dict]:
        """Retrieve stored transcription.
        
        Args:
            call_id: Unique call identifier
            
        Returns:
            Transcription record or None
        """
        return self.transcriptions.get(call_id)
    
    def search_transcriptions(self, keyword: str) -> List[dict]:
        """Search transcriptions by keyword.
        
        Args:
            keyword: Search keyword
            
        Returns:
            List of matching transcription records
        """
        results = []
        for call_id, record in self.transcriptions.items():
            if keyword.lower() in record['text'].lower():
                results.append({
                    'call_id': call_id,
                    **record
                })
        return results
