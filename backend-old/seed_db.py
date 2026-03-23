from sqlmodel import Session, select
from database import engine
from models.models import SiteContent, TeamMember, Project, HeroImage, Gallery

def seed_data():
    with Session(engine) as session:
        # 1. Site Content
        contents = [
            SiteContent(key="mission", title="Our Mission", content="To identify young Leaders through a rigorous selection process that assess knowledge base; competence; skills; apt for learning; intuition, relational abilities and character. To raise Credible, Competent and Principled drivers of Effective and Progressive leadership in the Nations of life through strategic and deliberate leadership trainings and mentorship."),
            SiteContent(key="vision", title="Our Vision", content="High performing Leaders providing the nations with genuine leadership.")
        ]
        
        # 2. Team Members
        team = [
            TeamMember(name="Abel Ajayi", position="Co-Founder, IDELEH", bio="Abel is passionate about developing leadership skills in young people.", image_data="/images/team/abel.jpg"),
            TeamMember(name="Priscilla Asher John", position="Co-Founder, Executive Director", bio="Priscilla leads our flagship leadership programs with passion and dedication.", image_data="/images/team/priscilla.jpg"),
            TeamMember(name="Waltong David Tyoden", position="Co-Founder, IDELEH", bio="Waltong builds partnerships with local communities and organizations.", image_data="/images/team/waltong.jpeg")
        ]
        
        # 3. Projects
        projects = [
            Project(title="LeaderZ Conferences", description="The LeaderZ Conference aims to redefine the way secondary school prefects are trained, mentored, and empowered.", is_featured=True, display_order=1, image_data="/images/leaderz.jpg"),
            Project(title="Nation Building Conferences", description="Designed to inspire aspiring leaders to position themselves with the requisite knowledge and values required to address national challenges.", is_featured=True, display_order=2, image_data="/images/nbc.jpg"),
            Project(title="Mentorship Hub", description="A transformative learning experience empowering mentors and mentees.", is_featured=True, display_order=3, image_data="/images/mentorship.jpg")
        ]

        # 4. Hero Images
        heroes = [
            HeroImage(title="Empowering Tomorrow's Leaders", description="IDELEH is dedicated to identifying and raising credible leaders for global impact.", image_data="/images/purpose.jpg", display_order=1),
            HeroImage(title="Strategic Mentorship", description="Join our network of experienced mentors and aspiring leaders.", image_data="/images/mentorship2.jpg", display_order=2),
            HeroImage(title="Global Impact", description="Our initiatives are designed to create lasting change across nations.", image_data="/images/community.jpg", display_order=3)
        ]

        # 5. Gallery (Sectioned by Meeting/Folder)
        # Clear existing gallery to ensure meeting_name is populated correctly
        from sqlmodel import delete
        session.exec(delete(Gallery))
        
        gallery_items = [
            # Nation Building Conference University of Jos, 2024
            Gallery(title="Delegates at UNIJOS", meeting_name="Nation Building Conference University of Jos, 2024", image_data="/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0011.jpg"),
            Gallery(title="Keynote Session", meeting_name="Nation Building Conference University of Jos, 2024", image_data="/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0039.jpg"),
            Gallery(title="Interactive Participants", meeting_name="Nation Building Conference University of Jos, 2024", image_data="/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0040.jpg"),
            Gallery(title="Group Photo", meeting_name="Nation Building Conference University of Jos, 2024", image_data="/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0149.jpg"),
            Gallery(title="Closing Remarks", meeting_name="Nation Building Conference University of Jos, 2024", image_data="/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0158.jpg"),
            
            # Nation Building Conference, Federal College of Education Pankshin 2024
            Gallery(title="Opening Ceremony", meeting_name="Nation Building Conference, Federal College of Education Pankshin 2024", image_data="/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL4718.jpg"),
            Gallery(title="Dignitaries Present", meeting_name="Nation Building Conference, Federal College of Education Pankshin 2024", image_data="/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL4725.jpg"),
            Gallery(title="Speaker Presentation", meeting_name="Nation Building Conference, Federal College of Education Pankshin 2024", image_data="/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL4961.jpg"),
            Gallery(title="Audience Engagement", meeting_name="Nation Building Conference, Federal College of Education Pankshin 2024", image_data="/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL5038.jpg"),
            Gallery(title="Networking Session", meeting_name="Nation Building Conference, Federal College of Education Pankshin 2024", image_data="/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL5051.jpg"),
            
            # General Items
            Gallery(title="Community Outreach", meeting_name="General", image_data="/images/community.jpg"),
            Gallery(title="Leadership Workshop", meeting_name="General", image_data="/images/workshop.jpg"),
            Gallery(title="Training Session", meeting_name="General", image_data="/images/training.jpg")
        ]
        
        for item in gallery_items:
            session.add(item)
        
        session.commit()
        print("Data seeded successfully.")

if __name__ == "__main__":
    seed_data()
