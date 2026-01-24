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
    from app.graphql.schema import schema
except ImportError:
    # Fallback for import errors
    schema = None

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        # Return simple message for GET (GraphiQL hard to render in raw handler)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "alive", 
            "message": "Send POST requests with GraphQL queries here."
        }).encode('utf-8'))

    def do_POST(self):
        try:
            if not schema:
                raise Exception("Could not import GraphQL Schema")

            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            
            query = body.get('query')
            variables = body.get('variables')
            
            if not query:
                raise Exception("No query provided")

            # Execute GraphQL
            result = schema.execute_sync(query, variable_values=variables)
            
            response_data = {}
            if result.data:
                response_data['data'] = result.data
            if result.errors:
                response_data['errors'] = [{'message': str(e)} for e in result.errors]

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_resp = {
                "errors": [{"message": str(e), "traceback": traceback.format_exc().split('\n')}]
            }
            self.wfile.write(json.dumps(error_resp).encode('utf-8'))
