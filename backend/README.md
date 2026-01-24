# 🚀 Cyber Fashion Backend API

FastAPI + GraphQL + PostgreSQL backend for the Cyber Fashion 2070s store.

## 🛠️ Tech Stack

- **FastAPI** - Modern Python web framework
- **GraphQL** (Strawberry) - Efficient data fetching
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM
- **JWT** - Authentication
- **Alembic** - Database migrations

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- pip or poetry

## 🚀 Quick Start

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables

```bash
copy .env.example .env
```

Edit `.env` and configure:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cyber_fashion
SECRET_KEY=your-secret-key-min-32-characters
```

### 4. Create PostgreSQL Database

```sql
CREATE DATABASE cyber_fashion;
```

### 5. Run Database Migrations

The tables will be created automatically when you start the server, or you can run:

```bash
python -m app.main
```

### 6. Seed Database (Optional)

```bash
python -m app.seed
```

### 7. Start Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **GraphQL Playground**: http://localhost:8000/graphql
- **API Docs**: http://localhost:8000/docs

## 📊 Database Schema

### Users
- id, email, username, hashed_password
- full_name, is_active, is_admin
- created_at, updated_at

### Products
- id, title, description, price
- category (Clothes/Shoes/Bags/Accessories)
- gradient, size, stock, image_url
- is_active, created_at, updated_at

### Orders
- id, user_id, total_amount, status
- shipping_address, created_at, updated_at

### OrderItems
- id, order_id, product_id
- quantity, price, created_at

## 🔐 Authentication

### Register User

```graphql
mutation {
  register(input: {
    email: "user@example.com"
    username: "cyberfan"
    password: "SecurePass123!"
    fullName: "Cyber Fan"
  }) {
    accessToken
    tokenType
    user {
      id
      email
      username
    }
  }
}
```

### Login

```graphql
mutation {
  login(input: {
    email: "user@example.com"
    password: "SecurePass123!"
  }) {
    accessToken
    tokenType
    user {
      id
      email
      username
      isAdmin
    }
  }
}
```

## 📦 GraphQL Queries

### Get All Products

```graphql
query {
  products {
    id
    title
    description
    price
    category
    gradient
    size
    stock
    imageUrl
  }
}
```

### Get Products by Category

```graphql
query {
  products(category: CLOTHES) {
    id
    title
    price
    category
  }
}
```

### Get Single Product

```graphql
query {
  product(id: 1) {
    id
    title
    description
    price
    stock
  }
}
```

### Get My Orders

```graphql
query {
  myOrders(userId: 1) {
    id
    totalAmount
    status
    createdAt
    items {
      id
      quantity
      price
    }
  }
}
```

## 🛒 GraphQL Mutations

### Create Product (Admin)

```graphql
mutation {
  createProduct(input: {
    title: "Neon Jacket"
    description: "Holographic tech-fabric"
    price: 499.00
    category: CLOTHES
    gradient: "from-[#00d4ff] to-[#b300ff]"
    size: LARGE
    stock: 50
  }) {
    id
    title
    price
  }
}
```

### Create Order

```graphql
mutation {
  createOrder(
    userId: 1
    input: {
      items: [
        { productId: 1, quantity: 2 }
        { productId: 3, quantity: 1 }
      ]
      shippingAddress: "123 Cyber Street, Neo Tokyo"
    }
  ) {
    id
    totalAmount
    status
    createdAt
  }
}
```

## 🔧 API Endpoints

### REST Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /graphql` - GraphQL endpoint

### GraphQL Playground

Visit `http://localhost:8000/graphql` for interactive GraphQL playground.

## 📁 Project Structure

```
backend/
├── app/
│   ├── models/           # SQLAlchemy models
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── graphql/          # GraphQL schema
│   │   ├── types.py
│   │   ├── queries.py
│   │   ├── mutations.py
│   │   └── schema.py
│   ├── utils/            # Utilities
│   │   └── auth.py       # JWT & password hashing
│   ├── config.py         # Configuration
│   ├── database.py       # Database connection
│   ├── main.py           # FastAPI app
│   └── seed.py           # Database seeding
├── requirements.txt      # Dependencies
└── .env.example         # Environment template
```

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 🚀 Production Deployment

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:pass@db:5432/cyber_fashion
SECRET_KEY=<generate-secure-key>
ALLOWED_ORIGINS=https://yourdomain.com
```

## 📝 Notes

- JWT tokens expire after 30 minutes (configurable)
- Passwords are hashed using bcrypt
- CORS is configured for localhost:3000 by default
- Database tables are created automatically on startup

## 🔒 Security

- All passwords are hashed with bcrypt
- JWT tokens for authentication
- CORS protection
- SQL injection protection via SQLAlchemy ORM

## 📚 Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Strawberry GraphQL](https://strawberry.rocks/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

**Built with ⚡ for Cyber Fashion 2070s**
