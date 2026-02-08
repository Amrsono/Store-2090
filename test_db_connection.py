import psycopg2
import sys

def test_connection():
    try:
        print("Connecting to PostgreSQL...")
        # Update these with your settings if they differ
        conn = psycopg2.connect(
            dbname="modern_fashion",
            user="postgres",
            password="password",
            host="localhost",
            port="5432"
        )
        print("✅ Connection successful!")
        conn.close()
    except psycopg2.OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible solutions:")
        print("1. Ensure PostgreSQL service is started (e.g., 'pg_ctl start' or via Windows Services).")
        print("2. Verify that the port 5432 is correct.")
        print("3. Check if the 'modern_fashion' database exists.")
    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    test_connection()
