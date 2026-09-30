from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PatientBase(BaseModel):
    name: str
    email: str
    surgery_type: str
    surgery_date: str

class Patient(PatientBase):
    id: int
    risk_score: Optional[int] = 0
    
class PatientStatus(BaseModel):
    wound_score: int
    mobility_score: int
    pain_score: int
    overall_risk_score: int
    timestamp: datetime = datetime.now()

class Alert(BaseModel):
    id: int
    patient_id: int
    message: str
    severity: str # "HIGH", "MEDIUM", "LOW"
    timestamp: datetime = datetime.now()

class UploadResponse(BaseModel):
    filename: str
    file_type: str # "image", "video", "audio"
    analysis_score: int
    message: str
