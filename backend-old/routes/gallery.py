from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.models import Gallery

router = APIRouter()

@router.get("/", response_model=List[Gallery])
def read_gallery(session: Session = Depends(get_session)):
    images = session.exec(select(Gallery).order_by(Gallery.created_at.desc())).all()
    return images
