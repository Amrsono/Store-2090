import sys
import os
from http.server import BaseHTTPRequestHandler
import json

# Add the backend directory to sys.path
# In Vercel, the file structure might be different, let's try to find 'backend'
current_dir = os.path.dirname(__file__)
backend_dir = os.path.join(current_dir, '..', 'backend')
sys.path.append(backend_dir)

try:
    from app.main import app
    from mangum import Mangum
    
    # Wrap Mangum to ensure it handles the Vercel event format correctly
    # especially for POST requests which can sometimes be tricky
    mangum_handler = Mangum(app)
    
    def handler(event, context):
        # Allow OPTIONS for CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
                'body': ''
            }
            
        return mangum_handler(event, context)

except Exception as e:
    import traceback
    error_msg = traceback.format_exc()
    
    # Fallback handler to show the error
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "error": "Import Error in api/index.py",
                "details": str(e),
                "traceback": error_msg.split('\n'),
                "sys_path": sys.path,
                "cwd": os.getcwd(),
                "files_in_current": os.listdir(current_dir),
                "files_in_parent": os.listdir(os.path.join(current_dir, '..')) if os.path.exists(os.path.join(current_dir, '..')) else "N/A"
            }
            self.wfile.write(json.dumps(response).encode())
            return
    
    def handler(event, context):
        # Allow it to work as a Vercel serverless function equivalent
        # This is a bit of a hack to emulate the Mangum handler signature roughly or return standard output
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": "Critical Startup Error", 
                "message": str(e),
                "traceback": error_msg
            }),
            "headers": {"Content-Type": "application/json"}
        }

