import urllib.request
import urllib.error
import json

def test(url, method="POST"):
    print(f"Testing {method} {url}")
    try:
        req = urllib.request.Request(url, method=method)
        req.add_header('Content-Type', 'application/json')
        if method == "POST":
            data = {"query": "{ __schema { types { name } } }"}
            req.data = json.dumps(data).encode('utf-8')
        
        with urllib.request.urlopen(req) as res:
            print(f"Status: {res.status}")
            print(res.read().decode()[:100])
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}")
    except Exception as e:
        print(f"Error: {e}")

print("--- Checking localhost ---")
test("http://localhost:8000/graphql", "POST")
test("http://localhost:8000/graphql/", "POST")

print("\n--- Checking 127.0.0.1 ---")
test("http://127.0.0.1:8000/graphql", "POST")
test("http://127.0.0.1:8000/graphql/", "POST")
