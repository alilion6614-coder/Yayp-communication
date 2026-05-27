import logging
from typing import Dict, Optional
from enum import Enum
from datetime import datetime

logger = logging.getLogger(__name__)

class Department(Enum):
    """Available departments for call routing."""
    CUSTOMER_SUPPORT = 'customer_support'
    BILLING = 'billing'
    TECHNICAL = 'technical'
    SALES = 'sales'
    COMPLAINTS = 'complaints'
    GENERAL = 'general'

class CallRouter:
    """Routes calls to appropriate departments based on intent and context."""
    
    INTENT_TO_DEPARTMENT = {
        'CUSTOMER_SUPPORT': Department.CUSTOMER_SUPPORT,
        'BILLING_INQUIRY': Department.BILLING,
        'TECHNICAL_ISSUE': Department.TECHNICAL,
        'SALES_INQUIRY': Department.SALES,
        'COMPLAINT': Department.COMPLAINTS,
        'GREETING': Department.GENERAL,
        'FEEDBACK': Department.GENERAL,
        'APPOINTMENT_REQUEST': Department.SALES,
        'UNKNOWN': Department.GENERAL,
        'GOODBYE': Department.GENERAL
    }
    
    def __init__(self):
        """Initialize call router."""
        self.department_queues: Dict[Department, list] = {
            dept: [] for dept in Department
        }
        logger.info("Call router initialized")
    
    def route_call(self, intent: str, customer_id: str, priority: int = 1) -> Dict:
        """Route a call to the appropriate department.
        
        Args:
            intent: Customer's intent
            customer_id: Unique customer identifier
            priority: Priority level (1-5, 5 is highest)
            
        Returns:
            Routing information dict
        """
        department = self.INTENT_TO_DEPARTMENT.get(intent, Department.GENERAL)
        
        routing_info = {
            'customer_id': customer_id,
            'intent': intent,
            'department': department.value,
            'priority': priority,
            'timestamp': datetime.now().isoformat(),
            'queue_position': len(self.department_queues[department]) + 1
        }
        
        self.department_queues[department].append(routing_info)
        logger.info(f"Routed call to {department.value} for customer {customer_id}")
        return routing_info
    
    def get_queue_status(self, department: Optional[Department] = None) -> Dict:
        """Get current queue status.
        
        Args:
            department: Specific department or None for all
            
        Returns:
            Queue status information
        """
        if department:
            return {
                'department': department.value,
                'queue_length': len(self.department_queues[department]),
                'calls': self.department_queues[department]
            }
        
        return {
            'all_queues': {
                dept.value: len(calls) 
                for dept, calls in self.department_queues.items()
            },
            'total_calls': sum(len(calls) for calls in self.department_queues.values())
        }
    
    def dequeue_call(self, department: Department) -> Optional[Dict]:
        """Remove and return next call from queue.
        
        Args:
            department: Department queue to dequeue from
            
        Returns:
            Call information or None if queue is empty
        """
        if self.department_queues[department]:
            call = self.department_queues[department].pop(0)
            logger.info(f"Dequeued call for customer {call['customer_id']}")
            return call
        return None
    
    def prioritize_queue(self, department: Department) -> None:
        """Sort queue by priority (highest first).
        
        Args:
            department: Department queue to prioritize
        """
        self.department_queues[department].sort(
            key=lambda x: (-x['priority'], x['timestamp'])
        )
        logger.info(f"Prioritized queue for {department.value}")
