import urllib.request
import os

images = {
    "neon-jacket.jpg": "https://images.unsplash.com/photo-1485230946086-1d99d529a763?w=800&q=80",
    "cyber-shoes.jpg": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
    "quantum-backpack.jpg": "https://images.unsplash.com/photo-1590874103328-360702279165?w=800&q=80",
    "holo-sneakers.jpg": "https://images.unsplash.com/photo-1512990414788-d97cb4a25db3?w=800&q=80",
    "plasma-bag.jpg": "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&q=80",
    "cyberpunk-hoodie.jpg": "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
}

output_dir = "public/images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print(f"Downloading images to {output_dir}...")

for filename, url in images.items():
    filepath = os.path.join(output_dir, filename)
    try:
        print(f"Downloading {filename}...")
        # Use a User-Agent to avoid getting blocked by Unsplash
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        )
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Saved {filepath}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")

print("Done!")
