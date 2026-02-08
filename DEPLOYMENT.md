# 🚀 Deployment Guide - Quantum Store

Complete guide for deploying your Quantum Store to production on Vercel.

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Environment variables configured
- [ ] Git repository created and code committed
- [ ] README.md updated with project details

## 🌐 Deploy to Vercel (Recommended)

### Step 0: Database Setup (Alternatives to Supabase)

Since you cannot use Supabase, here are the best alternatives for a PostgreSQL database that works great with Vercel:

#### Option A: Vercel Postgres (Recommended - Easiest)
Directly integrated into your Vercel dashboard.
1.  Go to the **Storage** tab in your Vercel Project.
2.  Click **"Connect Store"** -> **"Create New"** -> **"Postgres"**.
3.  Once created, go to the `.env.local` tab and copy the `POSTGRES_URL` or `DATABASE_URL`.
4.  Use this as your `DATABASE_URL` environment variable.

#### Option B: Neon (Serverless Postgres)
The engine that powers Vercel Postgres.
1.  Go to [neon.tech](https://neon.tech).
2.  Create a Free Project.
3.  Copy the **Connection String** from the dashboard.
4.  **Important**: Ensure you use the "Pooled" connection string (usually port 6543) for serverless stability.

#### Option C: Railway or Render
- **Railway**: Go to [railway.app](https://railway.app), create a new PostgreSQL service.
- **Render**: Go to [render.com](https://render.com), create a new PostgreSQL database.

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done)
   ```bash
   cd cyberpunk-store
   git init
   git add .
   git commit -m "Initial commit: Quantum Store 2090s Cyberpunk SaaS"
   ```

2. **Create GitHub Repository**
   - Go to [github.com](https://github.com/new)
   - Create a new repository (e.g., `quantum-store`)
   - Don't initialize with README (we already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/quantum-store.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign Up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your `quantum-store` repository
   - Vercel will auto-detect Next.js

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** (if needed)
   - Add any environment variables
   - Example:
     ```
     ```
     NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
     NEXT_PUBLIC_GRAPHQL_URL=https://your-project.vercel.app/api/graphql
     
     # Backend Variables (Required for Python API)
     DATABASE_URL=postgresql://postgres.[ref]:[password]... (From Supabase)
     SECRET_KEY=generate-a-long-secure-random-string
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Step 3: Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `quantumstore.com`)

2. **Configure DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers for full DNS management

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - HTTPS enabled by default

## 🔧 Environment Variables

Create `.env.local` for local development:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_3D=true
```

For production, add these in Vercel dashboard under Settings → Environment Variables.

## 📊 Performance Optimization

### 1. Image Optimization

Next.js automatically optimizes images. Use the `Image` component:

```typescript
import Image from 'next/image';

<Image 
  src="/hero-bg.jpg" 
  alt="Hero" 
  width={1920} 
  height={1080}
  priority
/>
```

### 2. Font Optimization

Already configured with `next/font/google`:

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

### 3. Code Splitting

Next.js automatically code-splits by route. For component-level splitting:

```typescript
import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('@/components/Hero3D'), {
  ssr: false, // Disable SSR for 3D components
  loading: () => <div>Loading 3D scene...</div>
});
```

### 4. Caching Strategy

Vercel automatically caches static assets. Configure in `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

## 🔍 Monitoring & Analytics

### 1. Vercel Analytics

Enable in Vercel dashboard:
- Go to Project → Analytics
- Enable Web Analytics
- Add `@vercel/analytics` package:

```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Google Analytics (Optional)

```bash
npm install @next/third-parties
```

Update `app/layout.tsx`:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build fails with TypeScript errors
```bash
# Fix locally first
npm run build

# Check for errors
npm run lint
```

**Issue**: Out of memory during build
- Increase Node.js memory in Vercel settings
- Or add to `package.json`:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### 3D Elements Not Loading

**Issue**: Three.js components not rendering
- Ensure `'use client'` directive is present
- Check browser console for WebGL errors
- Consider SSR: false for 3D components

### Slow Performance

**Issue**: Large bundle size
```bash
# Analyze bundle
npm install @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- **Push to main**: Production deployment
- **Pull requests**: Preview deployments
- **Push to other branches**: Preview deployments

### Branch Strategy

```
main (production)
├── develop (staging)
└── feature/* (preview)
```

Configure in Vercel:
- Production Branch: `main`
- Preview Branches: All branches

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use Vercel's encrypted environment variables
   - Prefix public vars with `NEXT_PUBLIC_`

2. **API Security**
   - Use CORS properly
   - Implement rate limiting
   - Use HTTPS only

3. **Content Security Policy**

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

## 📱 Progressive Web App (Optional)

Convert to PWA:

```bash
npm install next-pwa
```

Create `next.config.ts`:

```typescript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
```

Create `public/manifest.json`:

```json
{
  "name": "Quantum Store",
  "short_name": "Quantum",
  "description": "2090s Cyberpunk SaaS Products",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#00d4ff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🎯 Post-Deployment

1. **Test Production Site**
   - Check all pages load
   - Verify 3D elements work
   - Test on mobile devices
   - Run Lighthouse audit

2. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry)
   - Monitor performance metrics

3. **SEO Optimization**
   - Submit sitemap to Google Search Console
   - Verify meta tags
   - Check Open Graph images

4. **Share Your Site**
   - Update README with live URL
   - Share on social media
   - Add to portfolio

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Community**: [vercel.com/community](https://vercel.com/community)

---

**🎉 Congratulations! Your Quantum Store is now live!**

*Built with ⚡ by the Quantum Team*
