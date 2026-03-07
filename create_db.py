import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ideleh")
# Base connection to 'postgres' database to create the new one
BASE_URL = DATABASE_URL.rsplit('/', 1)[0] + '/postgres'

def create_database():
    try:
        conn = psycopg2.connect(BASE_URL)
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("CREATE DATABASE ideleh;")
        print("Database 'ideleh' created successfully.")
        cur.close()
        conn.close()
    except psycopg2.errors.DuplicateDatabase:
        print("Database 'ideleh' already exists.")
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    create_database()
