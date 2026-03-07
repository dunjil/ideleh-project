from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from models.models import User, HeroImage, SiteContent, Event, Registration, Gallery, Project, TeamMember
from routes import events, projects, team, gallery, site_content, hero_images

app = FastAPI(title="IDELEH API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to IDELEH API"}

app.include_router(hero_images.router, prefix="/api/hero-images", tags=["hero"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(team.router, prefix="/api/team", tags=["team"])
app.include_router(gallery.router, prefix="/api/gallery", tags=["gallery"])
app.include_router(site_content.router, prefix="/api/content", tags=["content"])
