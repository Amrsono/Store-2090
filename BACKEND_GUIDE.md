# Backend Implementation Guide

This guide outlines how to implement the FastAPI + GraphQL + PostgreSQL backend for the Quantum Store.

## 🏗️ Architecture Overview

```
Backend Stack:
├── FastAPI (Python 3.11+)
├── GraphQL (Strawberry or Graphene)
├── PostgreSQL (Database)
├── SQLAlchemy (ORM)
├── Alembic (Migrations)
└── Redis (Caching - Optional)
```

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- pip or poetry
- Virtual environment tool

## 🚀 Setup Instructions

### 1. Create Backend Directory

```bash
mkdir backend
cd backend
```

### 2. Initialize Python Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

Create `requirements.txt`:

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
strawberry-graphql[fastapi]==0.219.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1
pydantic==2.5.3
pydantic-settings==2.1.0
python-dotenv==1.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

Install:
```bash
pip install -r requirements.txt
```

### 4. Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── graphql/             # GraphQL schema
│   │   ├── __init__.py
│   │   ├── schema.py
│   │   ├── queries.py
│   │   └── mutations.py
│   ├── crud/                # CRUD operations
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   └── utils/               # Utilities
│       ├── __init__.py
│       ├── auth.py
│       └── security.py
├── alembic/                 # Database migrations
├── tests/                   # Test files
├── .env                     # Environment variables
├── alembic.ini             # Alembic config
└── requirements.txt
```

## 📝 Implementation Examples

### 1. Database Configuration (`app/database.py`)

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 2. Product Model (`app/models/product.py`)

```python
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    category = Column(String(100))
    gradient = Column(String(100))
    size = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### 3. GraphQL Schema (`app/graphql/schema.py`)

```python
import strawberry
from typing import List, Optional
from app.graphql.queries import Query
from app.graphql.mutations import Mutation

schema = strawberry.Schema(query=Query, mutation=Mutation)
```

### 4. GraphQL Queries (`app/graphql/queries.py`)

```python
import strawberry
from typing import List, Optional
from app.models.product import Product as ProductModel
from app.database import get_db

@strawberry.type
class Product:
    id: int
    title: str
    description: str
    price: float
    category: str
    gradient: str
    size: str

@strawberry.type
class Query:
    @strawberry.field
    def products(self) -> List[Product]:
        db = next(get_db())
        products = db.query(ProductModel).all()
        return [Product(**product.__dict__) for product in products]
    
    @strawberry.field
    def product(self, id: int) -> Optional[Product]:
        db = next(get_db())
        product = db.query(ProductModel).filter(ProductModel.id == id).first()
        if product:
            return Product(**product.__dict__)
        return None
```

### 5. GraphQL Mutations (`app/graphql/mutations.py`)

```python
import strawberry
from app.models.product import Product as ProductModel
from app.database import get_db

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_product(
        self,
        title: str,
        description: str,
        price: float,
        category: str,
        gradient: str,
        size: str
    ) -> Product:
        db = next(get_db())
        product = ProductModel(
            title=title,
            description=description,
            price=price,
            category=category,
            gradient=gradient,
            size=size
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        return Product(**product.__dict__)
```

### 6. Main FastAPI App (`app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema
from app.config import settings

app = FastAPI(
    title="Quantum Store API",
    description="2090s Cyberpunk SaaS Backend",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GraphQL Router
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
async def root():
    return {
        "message": "Quantum Store API",
        "version": "1.0.0",
        "graphql": "/graphql"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### 7. Configuration (`app/config.py`)

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/quantumstore"
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 8. Environment Variables (`.env`)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/quantumstore
SECRET_KEY=your-super-secret-key-change-this-in-production
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```sql
CREATE DATABASE quantumstore;
CREATE USER quantumuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE quantumstore TO quantumuser;
```

### 2. Initialize Alembic

```bash
alembic init alembic
```

### 3. Configure Alembic (`alembic.ini`)

```ini
sqlalchemy.url = postgresql://quantumuser:your_password@localhost/quantumstore
```

### 4. Create Migration

```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🚀 Running the Backend

### Development

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🔗 Frontend Integration

### 1. Install GraphQL Client in Frontend

```bash
npm install @apollo/client graphql
```

### 2. Create Apollo Client (`lib/apollo-client.ts`)

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### 3. Example Query

```typescript
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      description
      price
      category
      gradient
      size
    }
  }
`;
```

### 4. Use in Component

```typescript
'use client';

import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/queries';

export default function ProductsList() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.products.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

## 🔐 Authentication

### JWT Token Generation

```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.config import settings

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
```

## 📊 Sample Data Seeding

Create `app/seed.py`:

```python
from app.database import SessionLocal
from app.models.product import Product

def seed_products():
    db = SessionLocal()
    
    products = [
        {
            "title": "Quantum Analytics Pro",
            "description": "Advanced AI-powered analytics dashboard",
            "price": 299.00,
            "category": "Analytics",
            "gradient": "from-[#00d4ff] to-[#b300ff]",
            "size": "large"
        },
        # Add more products...
    ]
    
    for product_data in products:
        product = Product(**product_data)
        db.add(product)
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_products()
```

Run: `python -m app.seed`

## 🧪 Testing

Create `tests/test_products.py`:

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_products():
    response = client.post(
        "/graphql",
        json={
            "query": "{ products { id title price } }"
        }
    )
    assert response.status_code == 200
    assert "data" in response.json()
```

Run tests:
```bash
pytest
```

## 🚢 Deployment

### Docker Setup

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: quantumstore
      POSTGRES_USER: quantumuser
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://quantumuser:your_password@db:5432/quantumstore
    depends_on:
      - db

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Strawberry GraphQL](https://strawberry.rocks/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

**Ready to build the quantum-secure backend! 🚀**
