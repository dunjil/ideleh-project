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

@router.post("/", response_model=Event)
def create_event(event_data: dict, session: Session = Depends(get_session)):
    from datetime import datetime
    
    title = event_data.get("title")
    description = event_data.get("description")
    event_date_str = event_data.get("event_date")
    image_data = event_data.get("image_data")
    
    if not title or not description or not event_date_str:
        raise HTTPException(status_code=400, detail="Title, description and event_date are required")
        
    try:
        # Pydantic or frontend might send iso format
        event_date = datetime.fromisoformat(event_date_str.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

    event = Event(
        title=title,
        description=description,
        event_date=event_date,
        image_data=image_data
    )
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

@router.patch("/{event_id}", response_model=Event)
def update_event(event_id: str, event_data: dict, session: Session = Depends(get_session)):
    from datetime import datetime
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if "title" in event_data:
        event.title = event_data["title"]
    if "description" in event_data:
        event.description = event_data["description"]
    if "event_date" in event_data:
        try:
            event.event_date = datetime.fromisoformat(event_data["event_date"].replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")
    if "image_data" in event_data:
        event.image_data = event_data["image_data"]
        
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

@router.delete("/{event_id}")
def delete_event(event_id: str, session: Session = Depends(get_session)):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Optional: Delete associated registrations first if needed by foreign key constraints, 
    # but cascade is usually preferred or we just delete. Let's delete registrations first to be safe.
    from models.models import Registration
    from sqlmodel import select
    registrations = session.exec(select(Registration).where(Registration.event_id == event.id)).all()
    for reg in registrations:
        session.delete(reg)
        
    session.delete(event)
    session.commit()
    return {"success": True}

@router.get("/{event_id}/registrations")
def read_event_registrations(event_id: str, session: Session = Depends(get_session)):
    from models.models import Registration
    from sqlmodel import select
    # Verify event exists
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    registrations = session.exec(
        select(Registration)
        .where(Registration.event_id == event.id)
        .order_by(Registration.created_at.desc())
    ).all()
    
    return registrations

@router.post("/{event_id}/registrations")
def create_event_registration(event_id: str, registration_data: dict, session: Session = Depends(get_session)):
    from models.models import Registration
    
    # Verify event exists
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    first_name = registration_data.get("first_name")
    last_name = registration_data.get("last_name")
    email = registration_data.get("email")
    
    if not first_name or not last_name or not email:
        raise HTTPException(status_code=400, detail="First name, last name, and email are required")
        
    registration = Registration(
        event_id=event.id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=registration_data.get("phone", ""),
        gender=registration_data.get("gender", ""),
        country=registration_data.get("country", "Nigeria"),
        city=registration_data.get("city", ""),
        expectation=registration_data.get("expectation", "")
    )
    
    session.add(registration)
    session.commit()
    session.refresh(registration)
    
    return registration
