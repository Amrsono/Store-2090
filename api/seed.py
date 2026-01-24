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
            # Import inside handler to ensure path is set
            from app.seed import seed_products
            
            # Run the seed function
            seed_products()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "success", 
                "message": "Database seeded successfully. Admin: admin@cyber.com"
            }).encode('utf-8'))
            
        except ImportError as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "error",
                "message": "Import Error: Could not load backend modules.",
                "details": str(e),
                "sys_path": sys.path,
                "traceback": traceback.format_exc().split('\n')
            }).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "error",
                "message": "Seeding Logic Error",
                "details": str(e),
                "traceback": traceback.format_exc().split('\n')
            }).encode('utf-8'))
