import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ideleh")

folders = [
    ("Abuja Prefects Conference, 2023", "Abuja Prefects Conference, 2023"),
    ("Nation Building Conference University of Jos, 2024", "Nation Building Conference UNIJOS 2024"),
    ("Nation Building Conference, Federal College of Education Pankshin 2024", "Nation Building Conference FCE Pankshin 2024")
]

public_images_dir = "/home/duna/Desktop/ideleh-project/public/images"

def seed_gallery():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Clear existing gallery
        cur.execute("DELETE FROM gallery;")
        
        for folder, title_prefix in folders:
            folder_path = os.path.join(public_images_dir, folder)
            if os.path.exists(folder_path):
                images = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.heic'))]
                # Sort to ensure consistent order
                images.sort()
                for idx, img in enumerate(images):
                    # For HEIC, Next.js might have issues rendering natively without a converter, 
                    # but let's seed them so the DB has something.
                    image_path = f"/images/{folder}/{img}"
                    title = f"{title_prefix} - Image {idx+1}"
                    cur.execute("INSERT INTO gallery (title, image_data) VALUES (%s, %s)", (title, image_path))
        
        conn.commit()
        cur.close()
        conn.close()
        print("Gallery seeded successfully!")
    except Exception as e:
        print(f"Error seeding gallery: {e}")

if __name__ == "__main__":
    seed_gallery()
