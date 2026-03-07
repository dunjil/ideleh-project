from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.models import TeamMember

router = APIRouter()

@router.get("/", response_model=List[TeamMember])
def read_team(session: Session = Depends(get_session)):
    team = session.exec(select(TeamMember).order_by(TeamMember.created_at)).all()
    return team
