from sqlmodel import Session, select
from database import engine
from models.models import Project

def test_query():
    with Session(engine) as session:
        try:
            print("Querying projects...")
            projects = session.exec(select(Project)).all()
            print(f"Found {len(projects)} projects.")
            for p in projects:
                print(f"Project: {p.title}, Display Order: {getattr(p, 'display_order', 'N/A')}")
        except Exception as e:
            print(f"Error during query: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_query()
