# 🌌 Cyber Fashion - 2090s Cyberpunk Store

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green)](https://fastapi.tiangolo.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Strawberry-pink)](https://strawberry.rocks/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)

A cutting-edge, full-stack e-commerce platform for futuristic fashion with a stunning 2090s Minimalist Cyberpunk aesthetic.

![Cyber Fashion](https://img.shields.io/badge/Style-2090s_Cyberpunk-neon)

## ✨ Features

### 🎨 Frontend (Next.js)
- **Interactive 3D Hero Section** - React-Three-Fiber with floating holographic spheres
- **Glassmorphism UI** - Frosted glass effects throughout
- **Neon Glow Effects** - Electric blue, quantum purple, and plasma pink accents
- **Scroll Animations** - Smooth reveal-on-scroll with Framer Motion
- **Bento Grid Layout** - Modern, responsive product displays
- **Mobile-First Design** - Fully responsive on all devices
- **Dark Mode 2.0** - Deep obsidian backgrounds with neon accents

### 🚀 Backend (FastAPI + GraphQL)
- **GraphQL API** - Efficient data fetching with Strawberry
- **JWT Authentication** - Secure user authentication
- **PostgreSQL Database** - Relational data storage
- **SQLAlchemy ORM** - Type-safe database operations
- **User Management** - Registration, login, role-based access
- **Product Catalog** - Clothes, shoes, bags, and accessories
- **Order System** - Complete e-commerce order flow

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.4** - React framework with SSR/SSG
- **React 19.2.3** - UI library
- **TypeScript 5.0** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **React Three Fiber** - 3D graphics
- **Framer Motion 12.29.0** - Animations
- **Drei** - 3D helpers
- **Three.js** - WebGL rendering

### Backend
- **FastAPI 0.109.0** - Modern Python web framework
- **Strawberry GraphQL 0.219.0** - GraphQL library
- **PostgreSQL** - Database
- **SQLAlchemy 2.0.25** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Uvicorn** - ASGI server

## � Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/Amrsono/Store-2090.git
cd Store-2090
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at **http://localhost:3000**

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://postgres:password@localhost:5432/cyber_fashion

# Create PostgreSQL database
createdb cyber_fashion

# Run server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at:
- **API**: http://localhost:8000
- **GraphQL Playground**: http://localhost:8000/graphql
- **API Docs**: http://localhost:8000/docs

### 4. Seed Database (Optional)

```bash
cd backend
python -m app.seed
```

## 📁 Project Structure

```
Store-2090/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Hero3D.tsx
│   ├── FeaturesSection.tsx
│   ├── ProductsSection.tsx
│   ├── DashboardSection.tsx
│   └── Footer.tsx
├── lib/                   # Utilities
│   └── utils.ts
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── models/       # Database models
│   │   ├── graphql/      # GraphQL schema
│   │   ├── utils/        # Auth utilities
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── seed.py
│   ├── requirements.txt
│   └── README.md
├── public/               # Static assets
├── README.md            # This file
├── BACKEND_GUIDE.md     # Backend implementation guide
├── DEPLOYMENT.md        # Deployment instructions
├── PROJECT_SUMMARY.md   # Complete project summary
└── QUICKSTART.md        # Quick start guide
```

## 🎨 Design System

### Color Palette
```css
--obsidian: #0a0a0f        /* Deep background */
--deep-space: #12121a      /* Secondary background */
--neon-blue: #00d4ff       /* Primary accent */
--quantum-purple: #b300ff  /* Secondary accent */
--plasma-pink: #ff00ff     /* Tertiary accent */
--electric-cyan: #00fff5   /* Highlight */
--solar-yellow: #ffeb3b    /* Warning/Info */
--cyber-green: #00ff88     /* Success */
```

### Custom Utilities
- `.glass` - Glassmorphism effect
- `.neon-glow-blue` - Neon blue glow
- `.gradient-cyber` - Cyberpunk gradient
- `.text-gradient` - Gradient text
- `.hover-lift` - Lift on hover
- `.animate-float` - Floating animation

## � Database Schema

### Users
- Authentication and profile data
- Admin role support

### Products
- Title, description, price
- Category (Clothes/Shoes/Bags/Accessories)
- Stock management
- Image URLs

### Orders
- User orders with status tracking
- Shipping information

### OrderItems
- Individual items in orders
- Quantity and pricing

## 🔐 Authentication

### Register
```graphql
mutation {
  register(input: {
    email: "user@cyber.com"
    username: "cyberfan"
    password: "SecurePass123!"
  }) {
    accessToken
    user { id email }
  }
}
```

### Login
```graphql
mutation {
  login(input: {
    email: "user@cyber.com"
    password: "SecurePass123!"
  }) {
    accessToken
    user { id email isAdmin }
  }
}
```

## 📦 GraphQL API

### Get Products
```graphql
query {
  products(category: CLOTHES) {
    id
    title
    price
    category
    stock
  }
}
```

### Create Order
```graphql
mutation {
  createOrder(userId: 1, input: {
    items: [{ productId: 1, quantity: 2 }]
    shippingAddress: "123 Cyber St"
  }) {
    id
    totalAmount
    status
  }
}
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend (Docker)
```bash
cd backend
docker build -t cyber-fashion-api .
docker run -p 8000:8000 cyber-fashion-api
```

See `DEPLOYMENT.md` for detailed instructions.

## 📚 Documentation

- **README.md** - This file
- **BACKEND_GUIDE.md** - Complete backend setup
- **DEPLOYMENT.md** - Deployment guide
- **PROJECT_SUMMARY.md** - Feature summary
- **QUICKSTART.md** - Quick start guide
- **backend/README.md** - Backend API docs

## 🎯 Features Roadmap

- [x] Frontend UI with 3D elements
- [x] Product catalog
- [x] User authentication
- [x] Order system
- [x] GraphQL API
- [ ] Shopping cart
- [ ] Payment integration (Stripe)
- [ ] Admin dashboard
- [ ] Product reviews
- [ ] Wishlist
- [ ] Email notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## � License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI for the modern Python backend
- Strawberry for GraphQL implementation
- React Three Fiber for 3D capabilities
- Framer Motion for smooth animations

## 📞 Contact

- GitHub: [@Amrsono](https://github.com/Amrsono)
- Repository: [Store-2090](https://github.com/Amrsono/Store-2090)

---

**Built with ⚡ for the future of fashion**

*Experience 2090s style today* 🌌
