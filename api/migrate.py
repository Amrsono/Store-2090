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

            with engine.begin() as connection:
                print("Checking/Adding missing columns in 'users' table...")
                
                # Add email_verified
                try:
                    connection.execute(text("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE"))
                    print("Added email_verified")
                except Exception as e:
                    if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                        print("'email_verified' already exists")
                    else:
                        raise e

                # Add verification_token
                try:
                    connection.execute(text("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)"))
                    print("Added verification_token")
                except Exception as e:
                    if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                        print("'verification_token' already exists")
                    else:
                        raise e

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
