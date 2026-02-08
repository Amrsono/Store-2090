from sqlalchemy import text
from app.database import engine

def migrate():
    with engine.begin() as connection:
        print("Checking for missing columns in 'users' table...")
        
        # Check and add email_verified
        try:
            print("Attempting to add 'email_verified' column...")
            connection.execute(text("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE"))
            print("Successfully added 'email_verified'")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("'email_verified' column already exists")
            else:
                print(f"Error adding 'email_verified': {e}")

        # Check and add verification_token
        try:
            print("Attempting to add 'verification_token' column...")
            connection.execute(text("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)"))
            print("Successfully added 'verification_token'")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("'verification_token' column already exists")
            else:
                print(f"Error adding 'verification_token': {e}")
            
        print("Done!")

if __name__ == "__main__":
    migrate()
