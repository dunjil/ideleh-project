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

@router.post("/", response_model=Gallery)
def create_gallery_image(image_data: dict, session: Session = Depends(get_session)):
    from fastapi import HTTPException
    meeting_name = image_data.get("meeting_name")
    
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")
        
    image = Gallery(title=title, meeting_name=meeting_name, image_data=data)
    session.add(image)
    session.commit()
    session.refresh(image)
    return image

@router.delete("/{image_id}")
def delete_gallery_image(image_id: str, session: Session = Depends(get_session)):
    from fastapi import HTTPException
    image = session.get(Gallery, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
        
    session.delete(image)
    session.commit()
    return {"success": True}
