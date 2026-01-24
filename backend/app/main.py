from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema
from app.config import settings
from app.database import engine, Base
from app.models import User, Product, Order, OrderItem

# Create database tables
Base.metadata.create_all(bind=engine)

import os
root_path = "/api" if os.getenv("VERCEL") else ""

app = FastAPI(
    title="Cyber Fashion API",
    description="2070s Cyberpunk Fashion Store Backend with GraphQL",
    version="1.0.0",
    root_path=root_path
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
@app.options("/graphql")
@app.options("/graphql/")
async def graphql_options():
    return {}

# GraphQL Router
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")


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
