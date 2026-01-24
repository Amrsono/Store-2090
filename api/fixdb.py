from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import traceback

# Add the backend directory to sys.path
current_dir = os.path.dirname(__file__)
backend_dir = os.path.join(current_dir, '..', 'backend')
sys.path.append(backend_dir)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            from sqlalchemy import create_engine, text
            from app.config import settings
            
            # Manually get URL to avoid importing too much app logic
            db_url = settings.sync_database_url
            if db_url and db_url.startswith("postgres://"):
                db_url = db_url.replace("postgres://", "postgresql://", 1)
                
            engine = create_engine(db_url)
            
            print(f"Connecting to DB... {db_url[:10]}...")

            logs = []
            
            # Just fix the payment_method column
            try:
                with engine.begin() as connection:
                    connection.execute(text("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Cash'"))
                    logs.append("SUCCESS: Added payment_method column")
            except Exception as e:
                if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                    logs.append("INFO: payment_method already exists")
                else:
                    logs.append(f"ERROR: {str(e)}")

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "done",
                "logs": logs
            }).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "error",
                "message": str(e),
                "traceback": traceback.format_exc()
            }).encode('utf-8'))
