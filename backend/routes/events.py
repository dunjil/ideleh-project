from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.models import Event

router = APIRouter()

@router.get("/", response_model=List[Event])
def read_events(session: Session = Depends(get_session)):
    events = session.exec(select(Event)).all()
    return events

@router.get("/{event_id}", response_model=Event)
def read_event(event_id: str, session: Session = Depends(get_session)):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
