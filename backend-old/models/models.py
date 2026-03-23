from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HeroImage(SQLModel, table=True):
    __tablename__ = "hero_images"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    description: Optional[str] = None
    image_data: Optional[str] = None
    is_active: bool = Field(default=True)
    display_order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SiteContent(SQLModel, table=True):
    __tablename__ = "site_content"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    key: str = Field(unique=True, index=True)
    title: Optional[str] = None
    content: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Event(SQLModel, table=True):
    __tablename__ = "events"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    description: str
    image_data: Optional[str] = None
    event_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Registration(SQLModel, table=True):
    __tablename__ = "registrations"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    event_id: uuid.UUID = Field(foreign_key="events.id")
    first_name: str
    last_name: str
    gender: str
    country: str = Field(default="Nigeria")
    city: str = Field(default="")
    expectation: Optional[str] = None
    email: str
    phone: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Gallery(SQLModel, table=True):
    __tablename__ = "gallery"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    meeting_name: Optional[str] = None
    image_data: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeamMember(SQLModel, table=True):
    __tablename__ = "team_members"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    position: str
    bio: Optional[str] = None
    image_data: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    description: str
    image_data: Optional[str] = None
    is_featured: bool = Field(default=False)
    display_order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
