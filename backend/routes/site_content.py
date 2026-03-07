from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models.models import SiteContent

router = APIRouter()

@router.get("/{key}", response_model=SiteContent)
def read_content(key: str, session: Session = Depends(get_session)):
    content = session.exec(select(SiteContent).where(SiteContent.key == key)).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content
