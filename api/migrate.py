from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import traceback

# Add the backend directory to sys.path
current_dir = os.path.dirname(__file__)
backend_dir = os.path.join(current_dir, '..', 'backend')
sys.path.append(backend_dir)

try:
    from sqlalchemy import text
    from app.database import engine
except Exception:
    engine = None

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            if not engine:
                raise Exception("Could not import database engine")

            print("Checking/Adding missing columns...")
            
            # 1. Add email_verified
            try:
                with engine.begin() as connection:
                    connection.execute(text("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE"))
                    print("Added email_verified")
            except Exception as e:
                e_str = str(e).lower()
                if "already exists" in e_str or "duplicate column" in e_str:
                    print("'email_verified' already exists")
                else:
                    print(f"Error adding email_verified: {e}")

            # 2. Add verification_token
            try:
                with engine.begin() as connection:
                    connection.execute(text("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)"))
                    print("Added verification_token")
            except Exception as e:
                e_str = str(e).lower()
                if "already exists" in e_str or "duplicate column" in e_str:
                    print("'verification_token' already exists")
                else:
                    print(f"Error adding verification_token: {e}")

            # 3. Update products.image_url to TEXT (Postgres only)
            try:
                with engine.begin() as connection:
                    connection.execute(text("ALTER TABLE products ALTER COLUMN image_url TYPE TEXT"))
                    print("Updated products.image_url to TEXT")
            except Exception as e:
                print(f"Skipping products.image_url update: {str(e)}")

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "success",
                "message": "Database migration checks completed."
            }).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_resp = {
                "status": "error",
                "message": str(e),
                "traceback": traceback.format_exc().split('\n')
            }
            self.wfile.write(json.dumps(error_resp).encode('utf-8'))
