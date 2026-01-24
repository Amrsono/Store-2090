"""
Seed script to populate the database with initial fashion products
"""
from app.database import SessionLocal
from app.models import Product
from app.models.product import ProductCategory, ProductSize


def seed_products():
    db = SessionLocal()
    
    # Check if products already exist
    existing_products = db.query(Product).count()
    if existing_products == 0:
        products = [
            {
                "title": "Neon Streetwear Jacket",
                "description": "Holographic tech-fabric with reactive LED strips and quantum insulation",
                "price": 499.00,
                "category": ProductCategory.CLOTHES,
                "gradient": "from-[#00d4ff] to-[#b300ff]",
                "size": ProductSize.LARGE,
                "stock": 50,
                "image_url": "/images/neon-jacket.jpg"
            },
            {
                "title": "Cyber Running Shoes",
                "description": "Anti-gravity soles with neural sync technology",
                "price": 349.00,
                "category": ProductCategory.SHOES,
                "gradient": "from-[#ff00ff] to-[#00fff5]",
                "size": ProductSize.MEDIUM,
                "stock": 75,
                "image_url": "/images/cyber-shoes.jpg"
            },
            {
                "title": "Quantum Tech Backpack",
                "description": "Dimensional storage with biometric security",
                "price": 599.00,
                "category": ProductCategory.BAGS,
                "gradient": "from-[#00ff88] to-[#00d4ff]",
                "size": ProductSize.MEDIUM,
                "stock": 40,
                "image_url": "/images/quantum-backpack.jpg"
            },
            {
                "title": "Holographic Sneakers",
                "description": "Color-shifting nano-material with smart cushioning",
                "price": 279.00,
                "category": ProductCategory.SHOES,
                "gradient": "from-[#ffeb3b] to-[#ff00ff]",
                "size": ProductSize.SMALL,
                "stock": 100,
                "image_url": "/images/holo-sneakers.jpg"
            },
            {
                "title": "Plasma Shoulder Bag",
                "description": "Lightweight carbon-fiber with neon accent strips",
                "price": 399.00,
                "category": ProductCategory.BAGS,
                "gradient": "from-[#b300ff] to-[#00fff5]",
                "size": ProductSize.SMALL,
                "stock": 60,
                "image_url": "/images/plasma-bag.jpg"
            },
            {
                "title": "Cyberpunk Hoodie Set",
                "description": "Temperature-adaptive fabric with integrated AR display",
                "price": 699.00,
                "category": ProductCategory.CLOTHES,
                "gradient": "from-[#00d4ff] to-[#00ff88]",
                "size": ProductSize.LARGE,
                "stock": 30,
                "image_url": "/images/cyberpunk-hoodie.jpg"
            },
        ]
        
        for product_data in products:
            product = Product(**product_data)
            db.add(product)
        
        db.commit()
        print(f"✅ Successfully seeded {len(products)} products!")
    
    # Check if admin user exists
    from app.models import User
    from app.utils.auth import get_password_hash
    
    admin_email = "admin@cyber.com"
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    
    if not existing_admin:
        print(f"Creating admin user: {admin_email}")
        admin_user = User(
            email=admin_email,
            username="admin",
            hashed_password=get_password_hash("admin123"),
            is_admin=True,
            full_name="System Administrator"
        )
        db.add(admin_user)
        db.commit()
        print("✅ Admin user created successfully!")
    else:
        print("ℹ️ Admin user already exists.")

    db.close()


if __name__ == "__main__":
    print("🌱 Seeding database...")
    seed_products()
