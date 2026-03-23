import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ideleh")

engine = create_engine(DATABASE_URL)

def init_db():
    from models.models import User, HeroImage, SiteContent, Event, Registration, Gallery, TeamMember, Project
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
