# ⚡ Quick Start Guide - Quantum Store

Get up and running with the Quantum Store in 5 minutes!

## 🚀 Prerequisites

- **Node.js**: 20.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version

## 📦 Installation

### 1. Navigate to Project Directory

```bash
cd "d:\Store 2090\cyberpunk-store"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 16.1.4
- React 19.2.3
- TypeScript 5.0
- Tailwind CSS v4
- React Three Fiber
- Framer Motion
- And more...

## 🎮 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.x.x:3000

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

## 🌐 Accessing the Application

1. **Open your browser**
2. **Navigate to**: http://localhost:3000
3. **Explore the sections**:
   - Hero with 3D elements
   - Features showcase
   - Products bento grid
   - Analytics dashboard
   - Footer

## 🎨 What You'll See

### Hero Section
- Interactive 3D scene with floating spheres
- Cyber grid background
- Animated text with neon glow
- Glassmorphic navigation bar

### Features Section
- 6 feature cards with unique gradients
- Quantum Security, AI Analytics, Lightning Fast, etc.
- Smooth scroll animations
- CTA section

### Products Section
- Bento grid layout
- 6 SaaS products
- Glassmorphic cards
- Hover effects

### Dashboard Section
- Real-time analytics
- Interactive charts
- Activity feed
- Top products

### Footer
- Links and social media
- Newsletter signup
- Clean design

## 🛠️ Development Tips

### Hot Reload
Changes to files will automatically reload the browser.

### Component Structure
```
components/
├── Navbar.tsx          # Navigation
├── Hero3D.tsx          # 3D hero section
├── FeaturesSection.tsx # Features
├── ProductsSection.tsx # Products
├── DashboardSection.tsx# Dashboard
└── Footer.tsx          # Footer
```

### Styling
- Global styles: `app/globals.css`
- Tailwind utilities: Use custom classes like `.glass`, `.neon-glow-blue`
- Custom colors: Defined in CSS variables

### Adding New Components

1. Create file in `components/`
2. Use TypeScript
3. Add `'use client'` if using hooks
4. Import in `app/page.tsx`

Example:
```typescript
'use client';

import { motion } from 'framer-motion';

export default function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass p-8 rounded-2xl"
    >
      <h2 className="text-gradient">My Component</h2>
    </motion.div>
  );
}
```

## 🎯 Key Features to Try

### 1. 3D Interactions
- Hover over the floating spheres in the hero section
- Watch the auto-rotation
- Observe the cyber grid

### 2. Scroll Animations
- Scroll down slowly
- Watch elements fade in
- See the parallax effects

### 3. Hover Effects
- Hover over product cards
- Hover over feature cards
- Hover over navigation items

### 4. Responsive Design
- Resize your browser window
- Try on mobile (use DevTools)
- Check tablet view

### 5. Glassmorphism
- Notice the frosted glass effects
- See the transparent layers
- Observe the blur effects

## 📝 Customization Quick Tips

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --neon-blue: #YOUR_COLOR;
  --quantum-purple: #YOUR_COLOR;
}
```

### Add Products
Edit `components/ProductsSection.tsx`:
```typescript
const products: Product[] = [
  {
    id: 7,
    title: 'Your Product',
    description: 'Description',
    price: '$99/mo',
    category: 'Category',
    gradient: 'from-[#00d4ff] to-[#b300ff]',
    size: 'medium',
  },
];
```

### Modify 3D Scene
Edit `components/Hero3D.tsx`:
```typescript
<AnimatedSphere position={[0, 0, 0]} color="#YOUR_COLOR" />
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

### TypeScript Errors
```bash
# Check for errors
npm run build

# Fix linting
npm run lint -- --fix
```

### 3D Not Loading
- Check browser console
- Ensure WebGL is supported
- Try different browser

## 📚 Documentation

- **README.md** - Full project overview
- **BACKEND_GUIDE.md** - Backend setup
- **DEPLOYMENT.md** - Deployment guide
- **PROJECT_SUMMARY.md** - Complete summary

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🚀 Next Steps

1. **Explore the code** - Check out the components
2. **Customize** - Change colors, add features
3. **Deploy** - Follow DEPLOYMENT.md
4. **Add backend** - Follow BACKEND_GUIDE.md

## 💡 Pro Tips

- Use `Ctrl+C` to stop the dev server
- Check browser console for errors
- Use React DevTools for debugging
- Test on multiple browsers
- Keep dependencies updated

## 🎉 You're Ready!

The Quantum Store is now running locally. Enjoy exploring the 2090s cyberpunk aesthetic!

---

**Need help?** Check the documentation or open an issue.

**Happy coding! ⚡**
