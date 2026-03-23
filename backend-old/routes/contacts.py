from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models.models import Registration

router = APIRouter()

@router.get("/")
def get_unique_contacts(session: Session = Depends(get_session)):
    # To get unique registrants by email (acting as a contact list)
    # We can fetch all and distinct on email, getting the latest entry per email
    registrations = session.exec(
        select(Registration).order_by(Registration.created_at.desc())
    ).all()
    
    unique_contacts = {}
    for reg in registrations:
        if reg.email not in unique_contacts:
            unique_contacts[reg.email] = {
                "id": str(reg.id),
                "first_name": reg.first_name,
                "last_name": reg.last_name,
                "email": reg.email,
                "phone": reg.phone,
                "gender": reg.gender,
                "country": reg.country,
                "city": reg.city,
                "created_at": reg.created_at
            }
            
    contact_list = list(unique_contacts.values())
    return contact_list
