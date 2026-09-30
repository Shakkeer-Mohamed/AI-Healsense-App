from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from . import models, ai_mock
import os

router = APIRouter()

# Mock Database
mock_patients = [
    {"id": 1, "name": "John Doe", "email": "john@example.com", "surgery_type": "Knee Replacement", "surgery_date": "2023-10-01", "risk_score": 82},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "surgery_type": "Appendectomy", "surgery_date": "2023-10-05", "risk_score": 15},
]

mock_alerts = [
    {"id": 1, "patient_id": 1, "message": "Elevated infection risk detected from wound image.", "severity": "HIGH", "timestamp": "2023-10-10T10:00:00"},
]

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/patients", response_model=List[models.Patient])
def get_patients():
    return mock_patients

@router.get("/patients/{patient_id}", response_model=models.Patient)
def get_patient(patient_id: int):
    for p in mock_patients:
        if p["id"] == patient_id:
            return p
    raise HTTPException(status_code=404, detail="Patient not found")

@router.get("/alerts", response_model=List[models.Alert])
def get_alerts():
    return mock_alerts

@router.post("/upload/image", response_model=models.UploadResponse)
async def upload_image(patient_id: int, file: UploadFile = File(...)):
    contents = await file.read()
    # Save file locally
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Run Mock AI
    score = ai_mock.analyze_wound(contents)
    
    return models.UploadResponse(
        filename=file.filename,
        file_type="image",
        analysis_score=score,
        message=f"Image processed. Infection risk score: {score}"
    )

@router.post("/upload/video", response_model=models.UploadResponse)
async def upload_video(patient_id: int, file: UploadFile = File(...)):
    contents = await file.read()
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    score = ai_mock.analyze_gait(contents)
    
    return models.UploadResponse(
        filename=file.filename,
        file_type="video",
        analysis_score=score,
        message=f"Video processed. Mobility issue score: {score}"
    )

@router.post("/upload/audio", response_model=models.UploadResponse)
async def upload_audio(patient_id: int, file: UploadFile = File(...)):
    contents = await file.read()
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    score = ai_mock.analyze_speech(contents)
    
    return models.UploadResponse(
        filename=file.filename,
        file_type="audio",
        analysis_score=score,
        message=f"Audio processed. Pain indication score: {score}"
    )

@router.post("/analyze_patient/{patient_id}")
async def compile_patient_status(patient_id: int, wound_score: int, mobility_score: int, pain_score: int):
    overall_risk = ai_mock.calculate_overall_risk(wound_score, mobility_score, pain_score)
    
    # Update mock database
    for p in mock_patients:
        if p["id"] == patient_id:
            p["risk_score"] = overall_risk
            
            if overall_risk > 75:
                # Trigger alert
                alert = {
                    "id": len(mock_alerts) + 1,
                    "patient_id": patient_id,
                    "message": f"CRITICAL: Overall recovery risk score is High ({overall_risk}/100)",
                    "severity": "HIGH",
                    "timestamp": "Now"
                }
                mock_alerts.append(alert)
                
            return {"status": "success", "overall_risk": overall_risk}
            
    raise HTTPException(status_code=404, detail="Patient not found")
