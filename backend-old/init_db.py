import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ideleh")

def run_sql_file(filename):
    if not os.path.exists(filename):
        print(f"File {filename} not found.")
        return
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        with open(filename, 'r') as f:
            sql = f.read()
            cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        print(f"Successfully executed {filename}")
    except Exception as e:
        print(f"Error executing {filename}: {e}")

if __name__ == "__main__":
    # Ensure tables from schema.sql exist
    run_sql_file("schema.sql")
    # run_sql_file("seed-data.sql")
    print("Database initialization complete.")
