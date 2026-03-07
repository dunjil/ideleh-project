from sqlmodel import Session, select
from database import engine
from models.models import SiteContent, TeamMember, Project

def seed_data():
    with Session(engine) as session:
        # 1. Site Content
        contents = [
            SiteContent(key="mission", title="Our Mission", content="To identify young Leaders through a rigorous selection process that assess knowledge base; competence; skills; apt for learning; intuition, relational abilities and character. To raise Credible, Competent and Principled drivers of Effective and Progressive leadership in the Nations of life through strategic and deliberate leadership trainings and mentorship."),
            SiteContent(key="vision", title="Our Vision", content="High performing Leaders providing the nations with genuine leadership.")
        ]
        
        # 2. Team Members
        team = [
            TeamMember(name="Abel Ajayi", position="Co-Founder, IDELEH", bio="Abel is passionate about developing leadership skills in young people."),
            TeamMember(name="Priscilla Asher John", position="Co-Founder, Executive Director", bio="Priscilla leads our flagship leadership programs with passion and dedication."),
            TeamMember(name="Waltong David Tyoden", position="Co-Founder, IDELEH", bio="Waltong builds partnerships with local communities and organizations.")
        ]
        
        # 3. Projects
        projects = [
            Project(title="LeaderZ Conferences", description="The LeaderZ Conference aims to redefine the way secondary school prefects are trained, mentored, and empowered.", is_featured=True, display_order=1),
            Project(title="Nation Building Conferences", description="Designed to inspire aspiring leaders to position themselves with the requisite knowledge and values required to address national challenges.", is_featured=True, display_order=2),
            Project(title="Mentorship Hub", description="A transformative learning experience empowering mentors and mentees.", is_featured=True, display_order=3)
        ]
        
        for item in contents:
            if not session.exec(select(SiteContent).where(SiteContent.key == item.key)).first():
                session.add(item)
        
        for member in team:
            if not session.exec(select(TeamMember).where(TeamMember.name == member.name)).first():
                session.add(member)
                
        for project in projects:
            if not session.exec(select(Project).where(Project.title == project.title)).first():
                session.add(project)
        
        session.commit()
        print("Data seeded successfully.")

if __name__ == "__main__":
    seed_data()
