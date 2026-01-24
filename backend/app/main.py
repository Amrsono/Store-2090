from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema
from app.config import settings
from app.database import engine, Base
from app.models import User, Product, Order, OrderItem

# Create database tables
# Create database tables (Safe mode for Vercel)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"WARNING: Database table creation failed: {e}")
    # Continue startup even if DB fails, so we can see logs/health


import os
root_path = "/api" if os.getenv("VERCEL") else ""

app = FastAPI(
    title="Cyber Fashion API",
    description="2070s Cyberpunk Fashion Store Backend with GraphQL",
    version="1.0.0",
    root_path=root_path
)

@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"errors": [{"message": f"Internal Server Error: {str(e)}", "detail": traceback.format_exc()}]}
        )

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Explicit handling for OPTIONS request on Vercel (Must be defined BEFORE router)
# Explicit handling for OPTIONS request on Vercel (Must be defined BEFORE router)
# @app.options("/graphql")
# @app.options("/graphql/")
# async def graphql_options():
#     return {}

# GraphQL Router
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")
# Also mount at /api/graphql to catch unstripped requests
app.include_router(graphql_app, prefix="/api/graphql")


@app.get("/")
async def root():
    return {
        "message": "Cyber Fashion API",
        "version": "1.0.0",
        "graphql": "/graphql",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "cyber-fashion-api"}


@app.get("/seed")
async def seed_database():
    """
    Endpoint to seed the database with initial data (Products + Admin).
    Use this once after deployment to populate the production database.
    """
    try:
        from app.seed import seed_products
        seed_products()
        return {"status": "success", "message": "Database seeded successfully (Admin: admin@cyber.com)"}
    except Exception as e:
        import traceback
        tb_str = traceback.format_exc()
        # Print to server logs
        print(f"SEEDING ERROR: {str(e)}")
        print(tb_str)
        # Return to client
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": str(e),
                "traceback": tb_str.split('\n')
            }
        )

@app.get("/migrate")
async def migrate_database():
    """
    Endpoint to manually migrate database schema (add missing columns).
    Useful when adding new fields to existing production databases.
    """
    try:
        from sqlalchemy import text
        from sqlalchemy import text
        print("Checking/Adding missing columns in 'users' table...")
        
        # 1. Add email_verified
        try:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE"))
                print("Added email_verified")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("'email_verified' already exists")
            else:
                print(f"Error adding email_verified: {e}")

        # 2. Add verification_token
        try:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)"))
                print("Added verification_token")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
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
                    
        return {"status": "success", "message": "Database migration checks completed."}
    except Exception as e:
        import traceback
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e), "traceback": traceback.format_exc()}
        )
