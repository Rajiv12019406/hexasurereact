from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.crud import create_contact_message, get_contact_messages
from app.schemas import ContactMessageCreate, ContactMessageResponse, InvestmentMessageCreate, MessageResponse
from app.core.security import get_current_super_admin
from app.models import User as UserModel


router = APIRouter()


@router.post("/contact", response_model=MessageResponse)
def submit_contact_form(contact_data: ContactMessageCreate, db: Session = Depends(get_db)):
    programmes = {
        "cube_puzzles": "Cube Puzzles & Speedcubing",
        "sudoku_reasoning": "Sudoku & Logical Reasoning",
        "math_olympiad": "Mathematical Olympiad & Problem-Solving",
        "not_sure": "Not sure yet",
    }
    
    if contact_data.type not in programmes:
        raise HTTPException(status_code=400, detail="Invalid programme type")
    
    if not contact_data.guardian_confirmation:
        raise HTTPException(status_code=400, detail="Guardian confirmation required")
    
    message_parts = [
        "Adult contact confirmation: adult; parent/guardian submitting for any student under 18.",
        f"Programme of interest: {programmes[contact_data.type]}",
    ]
    
    if contact_data.message:
        message_parts.append(f"Learning goals or questions: {contact_data.message}")
    
    full_message = "\n\n".join(message_parts)
    
    message_data = {
        "name": contact_data.name,
        "email": contact_data.email,
        "company": "",
        "region": contact_data.region or "",
        "type": "general",
        "message": full_message,
    }
    
    create_contact_message(db=db, message_data=message_data)
    
    return {"message": "Thank you. Your enquiry has been received. This is not a confirmed booking; we'll be in touch to discuss next steps."}


@router.post("/investment", response_model=MessageResponse)
def submit_investment_form(investment_data: InvestmentMessageCreate, db: Session = Depends(get_db)):
    message_data = {
        "name": investment_data.name,
        "email": investment_data.email,
        "company": investment_data.organization or "",
        "region": investment_data.region or "",
        "type": "partnership",
        "message": investment_data.message,
    }
    
    create_contact_message(db=db, message_data=message_data)
    
    return {"message": "Thank you for your interest. We will be in touch shortly."}


@router.get("/messages", response_model=List[ContactMessageResponse])
def list_contact_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_super_admin)
):
    return get_contact_messages(db, skip, limit)