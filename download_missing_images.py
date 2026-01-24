import urllib.request
import os

images = {
    "neon-jacket.jpg": "https://images.unsplash.com/photo-1551488852-d814c9e892c0?w=800&q=80",
    "quantum-backpack.jpg": "https://images.unsplash.com/photo-1581605405669-fcdf8116cafa?w=800&q=80"
}

output_dir = "public/images"

for filename, url in images.items():
    filepath = os.path.join(output_dir, filename)
    if not os.path.exists(filepath):
        print(f"Downloading missing {filename}...")
        try:
            req = urllib.request.Request(
                url, 
                data=None, 
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Saved {filepath}")
        except Exception as e:
            print(f"Failed: {e}")
    else:
        print(f"Skipping {filename} (exists)")
