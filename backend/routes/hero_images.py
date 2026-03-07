from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.models import HeroImage

router = APIRouter()

@router.get("/", response_model=List[HeroImage])
def read_hero_images(session: Session = Depends(get_session)):
    hero_images = session.exec(select(HeroImage).where(HeroImage.is_active == True).order_by(HeroImage.display_order)).all()
    return hero_images
